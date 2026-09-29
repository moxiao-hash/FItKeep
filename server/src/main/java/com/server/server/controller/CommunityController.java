package com.server.server.controller;

import com.server.server.service.CommunityService;
import com.server.server.util.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping("/posts")
    public Result<?> posts() {
        return Result.success(communityService.getVisiblePosts());
    }

    @GetMapping("/post/{id}")
    public Result<?> post(@PathVariable Long id) {
        var post = communityService.getPostById(id);
        if (post == null || post.getStatus() == null || post.getStatus() != 1) {
            return Result.error("帖子不存在或已被隐藏");
        }
        var comments = communityService.getComments(id);
        return Result.success(Map.of("post", post, "comments", comments));
    }

    @PostMapping("/post")
    public Result<?> createPost(@RequestBody Map<String, String> body, Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            var post = communityService.createPost(userId, body.get("title"), body.get("content"), body.get("imageUrl"));
            return Result.success(post);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/post/{id}/like")
    public Result<?> like(@PathVariable Long id) {
        communityService.likePost(id);
        return Result.success();
    }

    @PostMapping("/post/{id}/comment")
    public Result<?> comment(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            var comment = communityService.addComment(id, userId, body.get("content"));
            return Result.success(comment);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/post/{id}")
    public Result<?> deletePost(@PathVariable Long id, Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            return Result.error("未登录或身份凭证无效");
        }
        try {
            Long userId = (Long) auth.getPrincipal();
            boolean isAdmin = auth.getAuthorities() != null && auth.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
            communityService.deletePostWithPermission(id, userId, isAdmin);
            return Result.success();
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
