package com.server.server.config;

import com.server.server.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final FileService fileService;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 必须通过 toURI() 转为标准 file URL，否则 Windows 路径中的反斜杠和中文会导致 Spring 解析失败
        String fileUrl = new java.io.File(fileService.getUploadDir()).toURI().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(fileUrl);
    }


    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/user/index.html");
    }
}
