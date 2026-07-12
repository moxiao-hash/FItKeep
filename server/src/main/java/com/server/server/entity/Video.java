package com.server.server.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Video {
    private Long id;
    private Long courseId;
    private String title;
    private String url;
    private Integer duration; // seconds
    private Integer sortOrder;
    private LocalDateTime createTime;
}
