package com.server.server.service;

import com.server.server.entity.CheckIn;
import com.server.server.mapper.CheckInMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInMapper checkInMapper;

    public boolean checkInToday(Long userId) {
        LocalDate today = LocalDate.now();
        return checkInMapper.findByUserIdAndDate(userId, today) != null;
    }

    public CheckIn doCheckIn(Long userId, String content, Integer duration, String imageUrl) {
        LocalDate today = LocalDate.now();
        if (checkInMapper.findByUserIdAndDate(userId, today) != null) {
            throw new RuntimeException("今日已打卡");
        }
        CheckIn checkIn = new CheckIn();
        checkIn.setUserId(userId);
        checkIn.setCheckDate(today);
        checkIn.setContent(content);
        checkIn.setDuration(duration);
        checkIn.setImageUrl(imageUrl);
        checkInMapper.insert(checkIn);
        return checkIn;
    }

    public List<CheckIn> getUserCheckIns(Long userId) {
        return checkInMapper.findByUserId(userId);
    }

    public List<CheckIn> getAllCheckIns() {
        return checkInMapper.findAll();
    }

    public int getUserCheckInCount(Long userId) {
        return checkInMapper.countByUserId(userId);
    }

    public int countAll() {
        return checkInMapper.countAll();
    }

    public void deleteCheckIn(Long id) {
        checkInMapper.deleteById(id);
    }
}
