package com.server.server.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Comment {
    private Long id;
    private Long postId;
    private Long userId;
    private String username;
    private String userAvatar;
    private String content;
    private LocalDateTime createTime;
}
