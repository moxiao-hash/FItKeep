package com.server.server.controller;

import com.server.server.mapper.VideoMapper;
import com.server.server.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UploadController {
    private static final Map<String, MediaType> TYPES = Map.of(
            "jpg", MediaType.IMAGE_JPEG,
            "jpeg", MediaType.IMAGE_JPEG,
            "png", MediaType.IMAGE_PNG,
            "gif", MediaType.IMAGE_GIF,
            "webp", MediaType.parseMediaType("image/webp"),
            "mp4", MediaType.parseMediaType("video/mp4"),
            "webm", MediaType.parseMediaType("video/webm"),
            "mov", MediaType.parseMediaType("video/quicktime"));

    private final FileService fileService;
    private final VideoMapper videoMapper;

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> download(@PathVariable String filename, Authentication authentication) {
        try {
            Path path = fileService.resolveUpload(filename);
            if (!Files.isRegularFile(path)) return ResponseEntity.notFound().build();
            String ext = filename.substring(filename.lastIndexOf('.') + 1);
            MediaType type = TYPES.get(ext);
            if (type == null) return ResponseEntity.notFound().build();
            if (type.getType().equals("video")) {
                String url = "/uploads/" + filename;
                boolean admin = authentication != null && authentication.getAuthorities().stream()
                        .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
                if (!admin && videoMapper.countPublishedByUrl(url) == 0) {
                    return ResponseEntity.notFound().build();
                }
            }
            return ResponseEntity.ok()
                    .contentType(type)
                    .header("X-Content-Type-Options", "nosniff")
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(new FileSystemResource(path));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
