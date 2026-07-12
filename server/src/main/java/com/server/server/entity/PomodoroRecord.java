package com.server.server.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PomodoroRecord {
    private Long id;
    private Long userId;
    private Integer focusMinutes;
    private Integer breakMinutes;
    private Integer cycles;
    private String note;
    private LocalDateTime createTime;
}
