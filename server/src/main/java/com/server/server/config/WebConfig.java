package com.server.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/user/index.html");
        registry.addViewController("/user").setViewName("redirect:/user/");
        registry.addViewController("/user/").setViewName("forward:/user/index.html");
        registry.addViewController("/admin").setViewName("redirect:/admin/");
        registry.addViewController("/admin/").setViewName("forward:/admin/index.html");
    }
}
