package com.server.server.controller;

import com.server.server.entity.Course;
import com.server.server.entity.Video;
import com.server.server.service.CourseService;
import com.server.server.util.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/list")
    public Result<?> list(@RequestParam(required = false) String category) {
        return Result.success(courseService.getPublishedCourses(category));
    }

    @GetMapping("/detail/{id}")
    public Result<?> detail(@PathVariable Long id) {
        try {
            return Result.success(courseService.getCourseDetail(id));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/videos/{courseId}")
    public Result<?> videos(@PathVariable Long courseId) {
        try {
            return Result.success(courseService.getVideosByCourse(courseId));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
