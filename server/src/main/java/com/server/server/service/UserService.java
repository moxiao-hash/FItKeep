package com.server.server.service;

import com.server.server.entity.User;
import com.server.server.mapper.UserMapper;
import com.server.server.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Map<String, Object> register(String username, String password, String nickname) {
        if (userMapper.findByUsername(username) != null) {
            throw new RuntimeException("用户名已存在");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(nickname != null ? nickname : username);
        user.setRole(0);
        user.setStatus(1);
        userMapper.insert(user);
        Map<String, Object> res = new HashMap<>();
        res.put("id", user.getId());
        res.put("username", user.getUsername());
        return res;
    }

    public Map<String, Object> login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        if (user.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        Map<String, Object> res = new HashMap<>();
        res.put("token", token);
        res.put("userId", user.getId());
        res.put("username", user.getUsername());
        res.put("nickname", user.getNickname());
        res.put("role", user.getRole());
        res.put("avatar", user.getAvatar());
        return res;
    }

    public User findById(Long id) {
        return userMapper.findById(id);
    }

    public List<User> findAll() {
        return userMapper.findAll();
    }

    public void updateUser(User user) {
        userMapper.update(user);
    }

    public void deleteUser(Long id) {
        userMapper.deleteById(id);
    }

    public int countAll() {
        return userMapper.countAll();
    }
}
