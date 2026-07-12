package com.server.server.controller;

import com.server.server.service.FileService;
import com.server.server.util.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public Result<?> upload(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileService.uploadFile(file);
            return Result.success(url);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
