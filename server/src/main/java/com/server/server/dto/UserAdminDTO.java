package com.server.server.dto;

import com.server.server.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserAdminDTO {
    private Long id;
    private String username;
    private String nickname;
    private String avatar;
    private String email;
    private String phone;
    private Integer role;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public static UserAdminDTO fromEntity(User user) {
        if (user == null) {
            return null;
        }
        UserAdminDTO dto = new UserAdminDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNickname(user.getNickname());
        dto.setAvatar(user.getAvatar());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreateTime(user.getCreateTime());
        dto.setUpdateTime(user.getUpdateTime());
        return dto;
    }
}
