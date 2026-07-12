package com.server.server.controller;

import com.server.server.service.UserService;
import com.server.server.util.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public Result<?> register(@RequestBody Map<String, String> body) {
        try {
            var res = userService.register(body.get("username"), body.get("password"), body.get("nickname"));
            return Result.success(res);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> body) {
        try {
            var res = userService.login(body.get("username"), body.get("password"));
            return Result.success(res);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
