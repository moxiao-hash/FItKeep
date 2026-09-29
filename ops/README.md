# FitKeep automatic deployment

The workflow builds and tests `server/` on pushes to `main`, then sends the JAR through one restricted SSH command. `workflow_dispatch` also supports a manual run. The service, database, environment file, uploads, and Cloudflare Tunnel remain on the VPS.

Protect `main` with review requirements. Both automatic and manual deployments run only from `main`, and anyone who can change `server/` there can run code on the VPS through the JAR.

## Provision the VPS

Install `bash`, `curl`, `flock` (from `util-linux`), and Python 3. Copy `ops/fitkeep-deploy.sh` to `/usr/local/sbin/fitkeep-deploy` as `root:root`, mode `0755`. Keep `/opt/fitkeep` and `/opt/fitkeep/fitkeep.jar` owned by root. The script creates `/opt/fitkeep/fitkeep.jar.previous` for rollback. Do not give the deployment account write access to `/opt/fitkeep`.

Create a dedicated `fitkeep-deploy` account without a password. Give it only this passwordless sudo command:

```text
Defaults:fitkeep-deploy !use_pty
fitkeep-deploy ALL=(root) NOPASSWD: /usr/local/sbin/fitkeep-deploy ""
```

The user-specific `!use_pty` setting preserves the binary JAR stream on standard input. The SSH key still disables PTY allocation and forces only the deploy command.

Put the public half of a dedicated deployment key in that account's `authorized_keys` with this restriction:

```text
restrict,command="sudo -n /usr/local/sbin/fitkeep-deploy" ssh-ed25519 PUBLIC_KEY fitkeep-deploy
```

Create a GitHub Actions environment named `production` with a deployment branch policy that allows only `main`. Set the private half as that environment's secret `FITKEEP_DEPLOY_KEY`. Never commit either the private key or `/opt/fitkeep/fitkeep.env`. The workflow pins the VPS ED25519 host key, so update the pin only after verifying a deliberate host-key rotation out of band.

## Release behavior

The VPS accepts one JAR of at most 150 MiB on standard input. It checks the ZIP and Spring Boot manifest, backs up the current JAR, replaces it atomically, and restarts `fitkeep.service`. Health checks require business code `200` from `/api/courses/list` and HTTP 200 from both `/user/` and `/admin/`. A failed restart or check restores the previous JAR and restarts the service. The script does not read or modify the database, `/opt/fitkeep/fitkeep.env`, or upload files.
