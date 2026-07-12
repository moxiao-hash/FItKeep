package com.server.server.controller;

import com.server.server.service.PomodoroService;
import com.server.server.util.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/pomodoro")
@RequiredArgsConstructor
public class PomodoroController {

    private final PomodoroService pomodoroService;

    @GetMapping("/records")
    public Result<?> records(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(pomodoroService.getRecords(userId));
    }

    @GetMapping("/stats")
    public Result<?> stats(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        int totalCycles = pomodoroService.getTotalCycles(userId);
        return Result.success(Map.of("totalCycles", totalCycles));
    }

    @PostMapping("/save")
    public Result<?> save(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            Long userId = (Long) auth.getPrincipal();
            Integer focusMinutes = Integer.parseInt(body.get("focusMinutes").toString());
            Integer breakMinutes = Integer.parseInt(body.get("breakMinutes").toString());
            Integer cycles = Integer.parseInt(body.get("cycles").toString());
            String note = (String) body.getOrDefault("note", "");
            var record = pomodoroService.saveRecord(userId, focusMinutes, breakMinutes, cycles, note);
            return Result.success(record);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
}
