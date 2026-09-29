package com.server.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload.path}")
    private String uploadPath;

    private static final long MAX_IMAGE_SIZE = 10L * 1024 * 1024; // 10MB
    private static final long MAX_VIDEO_SIZE = 100L * 1024 * 1024; // 100MB

    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".gif", ".webp");
    private static final Set<String> ALLOWED_VIDEO_EXTENSIONS = Set.of(".mp4", ".webm", ".mov");

    public String getUploadDir() {
        File dir = new File(uploadPath);
        if (!dir.isAbsolute()) {
            dir = new File(getBaseDir(), uploadPath);
        }
        if (!dir.exists()) dir.mkdirs();
        return dir.getAbsolutePath() + File.separator;
    }

    /**
     * 获取项目根目录，不依赖 user.dir。
     * 优先通过 classpath 推断（IDE 和 JAR 部署均适用），回退到 user.dir。
     */
    private File getBaseDir() {
        try {
            java.net.URL url = getClass().getClassLoader().getResource("");
            if (url != null && "file".equals(url.getProtocol())) {
                // classpath 在 server/target/classes/，往上 3 级即项目根目录
                File classesDir = new File(url.toURI());
                return classesDir.getParentFile().getParentFile().getParentFile();
            }
        } catch (Exception ignored) {}
        // Fallback: user.dir，但若当前在 server/ 子目录则取其父目录
        File userDir = new File(System.getProperty("user.dir"));
        if ("server".equals(userDir.getName()) && new File(userDir, "src").exists()) {
            return userDir.getParentFile();
        }
        return userDir;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        return upload(file, false);
    }

    public String uploadVideo(MultipartFile file) throws IOException {
        return upload(file, true);
    }

    private String upload(MultipartFile file, boolean video) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("上传文件不能为空");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.trim().isEmpty()) {
            throw new IllegalArgumentException("文件名不能为空");
        }

        String ext = "";
        int dotIndex = originalName.lastIndexOf(".");
        if (dotIndex >= 0) {
            ext = originalName.substring(dotIndex).toLowerCase(Locale.ROOT);
        }

        if (!(video ? ALLOWED_VIDEO_EXTENSIONS : ALLOWED_IMAGE_EXTENSIONS).contains(ext)) {
            throw new IllegalArgumentException("此接口不支持该文件类型");
        }

        long fileSize = file.getSize();
        if (!video && fileSize > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("图片文件大小超出限制（最大 10MB）");
        }
        if (video && fileSize > MAX_VIDEO_SIZE) {
            throw new IllegalArgumentException("视频文件大小超出限制（最大 100MB）");
        }

        byte[] header;
        try (var input = file.getInputStream()) {
            header = input.readNBytes(16);
        }
        if (!matchesContent(ext, file.getContentType(), header)) {
            throw new IllegalArgumentException("文件内容与类型不符");
        }

        String dir = getUploadDir();
        File uploadDir = new File(dir);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        File targetFile = new File(uploadDir, filename);

        if (!targetFile.getCanonicalFile().toPath().startsWith(uploadDir.getCanonicalFile().toPath())) {
            throw new SecurityException("非法的文件保存路径");
        }

        file.transferTo(targetFile);
        return "/uploads/" + filename;
    }

    private boolean matchesContent(String ext, String contentType, byte[] bytes) {
        if (contentType == null) return false;
        return switch (ext) {
            case ".png" -> "image/png".equals(contentType) && starts(bytes, 0x89, 'P', 'N', 'G', 13, 10, 26, 10);
            case ".jpg", ".jpeg" -> "image/jpeg".equals(contentType) && starts(bytes, 0xff, 0xd8, 0xff);
            case ".gif" -> "image/gif".equals(contentType) &&
                    (starts(bytes, 'G', 'I', 'F', '8', '7', 'a') || starts(bytes, 'G', 'I', 'F', '8', '9', 'a'));
            case ".webp" -> "image/webp".equals(contentType) && starts(bytes, 'R', 'I', 'F', 'F') &&
                    at(bytes, 8, 'W', 'E', 'B', 'P');
            case ".mp4" -> "video/mp4".equals(contentType) && at(bytes, 4, 'f', 't', 'y', 'p');
            case ".mov" -> ("video/quicktime".equals(contentType) || "video/mp4".equals(contentType)) &&
                    at(bytes, 4, 'f', 't', 'y', 'p') && at(bytes, 8, 'q', 't', ' ', ' ');
            case ".webm" -> "video/webm".equals(contentType) && starts(bytes, 0x1a, 0x45, 0xdf, 0xa3);
            default -> false;
        };
    }

    private boolean starts(byte[] bytes, int... signature) {
        return at(bytes, 0, signature);
    }

    private boolean at(byte[] bytes, int offset, int... signature) {
        if (bytes.length < offset + signature.length) return false;
        for (int i = 0; i < signature.length; i++) {
            if ((bytes[offset + i] & 0xff) != signature[i]) return false;
        }
        return true;
    }

    public Path resolveUpload(String filename) throws IOException {
        if (filename == null || !filename.matches("[0-9a-f]{32}\\.(?:jpg|jpeg|png|gif|webp|mp4|webm|mov)")) {
            throw new IllegalArgumentException("无效文件名");
        }
        Path root = Path.of(getUploadDir()).toRealPath();
        Path path = root.resolve(filename).toRealPath();
        if (!path.startsWith(root)) throw new IllegalArgumentException("无效文件名");
        return path;
    }
}
