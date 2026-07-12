package com.server.server.entity;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CheckIn {
    private Long id;
    private Long userId;
    private String username;
    private LocalDate checkDate;
    private String content;
    private Integer duration; // exercise minutes
    private String imageUrl;
    private Integer likeCount;
    private LocalDateTime createTime;
}
