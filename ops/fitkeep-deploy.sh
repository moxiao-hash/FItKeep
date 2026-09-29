#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR=/opt/fitkeep
JAR="$APP_DIR/fitkeep.jar"
BACKUP="$APP_DIR/fitkeep.jar.previous"
LOCK=/run/lock/fitkeep-deploy.lock
SERVICE=fitkeep.service
HEALTH_URL=http://127.0.0.1:8081/api/courses/list
USER_URL=http://127.0.0.1:8081/user/
ADMIN_URL=http://127.0.0.1:8081/admin/
MAX_JAR_BYTES=$((150 * 1024 * 1024))

if [[ "$(id -u)" -ne 0 ]]; then
  echo 'Deployment must run as root through the restricted sudo rule.' >&2
  exit 1
fi
if [[ ! -d "$APP_DIR" || -L "$APP_DIR" || ! -f "$JAR" || -L "$JAR" || -L "$BACKUP" ]]; then
  echo 'Expected application directory or JAR is missing or unsafe.' >&2
  exit 1
fi

exec 9>"$LOCK"
if ! flock -n 9; then
  echo 'Another deployment is in progress.' >&2
  exit 1
fi

incoming="$(mktemp "$APP_DIR/.fitkeep-incoming.XXXXXX")"
backup_temp="$(mktemp "$APP_DIR/.fitkeep-backup.XXXXXX")"
rollback_temp=''
deployed=0

healthy() {
  local response status
  systemctl is-active --quiet "$SERVICE" || return 1
  response="$(curl --fail --silent --show-error --connect-timeout 1 --max-time 3 "$HEALTH_URL" 2>/dev/null)" || return 1
  printf '%s' "$response" | python3 -c 'import json, sys; result = json.load(sys.stdin); sys.exit(0 if isinstance(result, dict) and result.get("code") == 200 else 1)' || return 1
  status="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --connect-timeout 1 --max-time 3 "$USER_URL" 2>/dev/null)" || return 1
  [[ "$status" == 200 ]] || return 1
  status="$(curl --silent --show-error --output /dev/null --write-out '%{http_code}' --connect-timeout 1 --max-time 3 "$ADMIN_URL" 2>/dev/null)" || return 1
  [[ "$status" == 200 ]]
}

wait_healthy() {
  local attempt
  for attempt in {1..10}; do
    if healthy; then
      return 0
    fi
    sleep 3
  done
  return 1
}

cleanup() {
  local status=$?
  trap - EXIT
  set +e
  if (( deployed )) && (( status != 0 )); then
    echo 'Deployment failed; restoring the previous JAR.' >&2
    rollback_temp="$(mktemp "$APP_DIR/.fitkeep-rollback.XXXXXX")"
    if cp -p -- "$BACKUP" "$rollback_temp" && mv -f -- "$rollback_temp" "$JAR"; then
      rollback_temp=''
      if timeout 45s systemctl restart "$SERVICE" && wait_healthy; then
        echo 'Previous JAR restored and healthy.' >&2
      else
        echo 'Rollback requires operator attention: previous JAR was restored but is not healthy.' >&2
      fi
    else
      echo 'Rollback requires operator attention: could not restore the previous JAR.' >&2
    fi
  fi
  rm -f -- "$incoming" "$backup_temp"
  if [[ -n "$rollback_temp" ]]; then
    rm -f -- "$rollback_temp"
  fi
  exit "$status"
}
trap cleanup EXIT

timeout 300s head -c "$((MAX_JAR_BYTES + 1))" > "$incoming"
if [[ ! -s "$incoming" ]] || (( $(wc -c < "$incoming") > MAX_JAR_BYTES )) || \
   ! timeout 60s python3 - "$incoming" <<'PY'
import sys
from zipfile import BadZipFile, ZipFile

try:
    with ZipFile(sys.argv[1]) as jar:
        entries = jar.infolist()
        if len(entries) > 10_000 or sum(entry.file_size for entry in entries) > 500 * 1024 * 1024:
            raise ValueError('JAR contents exceed the deployment limit')
        manifest = jar.getinfo('META-INF/MANIFEST.MF')
        launcher = jar.getinfo('org/springframework/boot/loader/launch/JarLauncher.class')
        if manifest.file_size > 1024 * 1024 or launcher.file_size == 0:
            raise ValueError('Spring Boot metadata is invalid')
        lines = jar.read(manifest).decode('utf-8').splitlines()
        if 'Main-Class: org.springframework.boot.loader.launch.JarLauncher' not in lines:
            raise ValueError('JAR has no Spring Boot launcher')
        if jar.testzip() is not None:
            raise BadZipFile('JAR contains a corrupt member')
except (BadZipFile, KeyError, OSError, RuntimeError, UnicodeError, ValueError) as error:
    print(f'Invalid Spring Boot JAR: {error}', file=sys.stderr)
    sys.exit(1)
PY
then
  echo 'Input is not an intact Spring Boot executable JAR.' >&2
  exit 1
fi

chmod 644 "$incoming"
cp -p -- "$JAR" "$backup_temp"
mv -f -- "$backup_temp" "$BACKUP"
mv -f -- "$incoming" "$JAR"
deployed=1

if ! timeout 45s systemctl restart "$SERVICE" || ! wait_healthy; then
  echo 'New JAR failed the service and API health checks.' >&2
  exit 1
fi

echo 'FitKeep deployment is healthy.'
