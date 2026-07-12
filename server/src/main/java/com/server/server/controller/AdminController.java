package com.server.server.controller;

import com.server.server.entity.Course;
import com.server.server.entity.User;
import com.server.server.entity.Video;
import com.server.server.service.*;
import com.server.server.util.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final CourseService courseService;
    private final CheckInService checkInService;
    private final CommunityService communityService;
    private final FileService fileService;

    @GetMapping("/stats")
    public Result<?> stats() {
        return Result.success(Map.of(
            "users", userService.countAll(),
            "courses", courseService.countAll(),
            "checkins", checkInService.countAll(),
            "posts", communityService.countAll()
        ));
    }

    // User management
    @GetMapping("/users")
    public Result<?> users() {
        return Result.success(userService.findAll());
    }

    @PutMapping("/user/{id}/status")
    public Result<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        User user = new User();
        user.setId(id);
        user.setStatus(body.get("status"));
        userService.updateUser(user);
        return Result.success();
    }

    @DeleteMapping("/user/{id}")
    public Result<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }

    // Course management
    @GetMapping("/courses")
    public Result<?> courses() {
        return Result.success(courseService.getAllCourses(null, null));
    }

    @PostMapping("/course")
    public Result<?> createCourse(@RequestBody Course course) {
        try {
            courseService.createCourse(course);
            return Result.success(course);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/course/upload-cover")
    public Result<?> uploadCourseCover(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileService.uploadFile(file);
            return Result.success(url);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PutMapping("/course")
    public Result<?> updateCourse(@RequestBody Course course) {
        courseService.updateCourse(course);
        return Result.success();
    }

    @DeleteMapping("/course/{id}")
    public Result<?> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return Result.success();
    }

    // Video management
    @PostMapping("/video")
    public Result<?> addVideo(@RequestBody Video video) {
        try {
            courseService.addVideo(video);
            return Result.success(video);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/video/upload")
    public Result<?> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileService.uploadFile(file);
            return Result.success(url);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/video/{id}")
    public Result<?> deleteVideo(@PathVariable Long id) {
        courseService.deleteVideo(id);
        return Result.success();
    }

    // Community management
    @GetMapping("/posts")
    public Result<?> allPosts() {
        return Result.success(communityService.getAllPosts());
    }

    @PutMapping("/post/{id}/status")
    public Result<?> updatePostStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        communityService.updatePostStatus(id, body.get("status"));
        return Result.success();
    }

    @DeleteMapping("/post/{id}")
    public Result<?> deletePost(@PathVariable Long id) {
        communityService.deletePost(id);
        return Result.success();
    }

    // CheckIn management
    @GetMapping("/checkins")
    public Result<?> allCheckIns() {
        return Result.success(checkInService.getAllCheckIns());
    }

    @DeleteMapping("/checkin/{id}")
    public Result<?> deleteCheckIn(@PathVariable Long id) {
        checkInService.deleteCheckIn(id);
        return Result.success();
    }
}
