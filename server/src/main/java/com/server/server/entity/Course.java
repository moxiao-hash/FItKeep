package com.server.server.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Course {
    private Long id;
    private String title;
    private String description;
    private String cover;
    private String category; // strength, cardio, yoga, etc.
    private Integer difficulty; // 1=beginner, 2=intermediate, 3=advanced
    private Integer duration; // minutes
    private Long teacherId;
    private String teacherName;
    private Integer status; // 0=draft, 1=published
    private Integer viewCount;
    private Integer enrollCount;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
