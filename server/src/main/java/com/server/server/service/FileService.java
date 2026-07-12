package com.server.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload.path}")
    private String uploadPath;

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
        String dir = getUploadDir();
        File uploadDir = new File(dir);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        String ext = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        file.transferTo(new File(dir + File.separator + filename));
        return "/uploads/" + filename;
    }
}
