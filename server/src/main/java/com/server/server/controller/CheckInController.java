package com.server.server.controller;

import com.server.server.service.CheckInService;
import com.server.server.util.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @GetMapping("/status")
    public Result<?> status(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        boolean checked = checkInService.checkInToday(userId);
        int total = checkInService.getUserCheckInCount(userId);
        return Result.success(Map.of("checkedToday", checked, "totalDays", total));
    }

    @PostMapping("/do")
    public Result<?> doCheckIn(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            String content = (String) body.get("content");
            Integer duration = body.get("duration") != null ? Integer.parseInt(body.get("duration").toString()) : 0;
            String imageUrl = (String) body.get("imageUrl");
            var result = checkInService.doCheckIn(userId, content, duration, imageUrl);
            return Result.success(result);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/my")
    public Result<?> myCheckIns(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(checkInService.getUserCheckIns(userId));
    }

    @GetMapping("/all")
    public Result<?> allCheckIns() {
        return Result.success(checkInService.getAllCheckIns());
    }
}
