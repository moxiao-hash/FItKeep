package com.server.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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

    public String uploadFile(MultipartFile file) throws IOException {
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

        boolean isImage = ALLOWED_IMAGE_EXTENSIONS.contains(ext);
        boolean isVideo = ALLOWED_VIDEO_EXTENSIONS.contains(ext);

        if (!isImage && !isVideo) {
            throw new IllegalArgumentException("不支持的文件类型，仅允许上传常用图片或视频文件");
        }

        long fileSize = file.getSize();
        if (isImage && fileSize > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("图片文件大小超出限制（最大 10MB）");
        }
        if (isVideo && fileSize > MAX_VIDEO_SIZE) {
            throw new IllegalArgumentException("视频文件大小超出限制（最大 100MB）");
        }

        String dir = getUploadDir();
        File uploadDir = new File(dir);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        File targetFile = new File(uploadDir, filename);

        if (!targetFile.getCanonicalPath().startsWith(uploadDir.getCanonicalPath())) {
            throw new SecurityException("非法的文件保存路径");
        }

        file.transferTo(targetFile);
        return "/uploads/" + filename;
    }
}
