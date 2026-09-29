package com.server.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Long id;
    private String username;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String nickname;
    private String avatar;
    private String email;
    private String phone;
    private Integer role; // 0=user, 1=admin
    private Integer status; // 0=disabled, 1=enabled
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
