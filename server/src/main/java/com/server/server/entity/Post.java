package com.server.server.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Post {
    private Long id;
    private Long userId;
    private String username;
    private String userAvatar;
    private String title;
    private String content;
    private String imageUrl;
    private Integer likeCount;
    private Integer commentCount;
    private Integer status; // 0=hidden, 1=visible
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
