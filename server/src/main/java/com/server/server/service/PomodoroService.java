package com.server.server.service;

import com.server.server.entity.PomodoroRecord;
import com.server.server.mapper.PomodoroMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PomodoroService {

    private final PomodoroMapper pomodoroMapper;

    public PomodoroRecord saveRecord(Long userId, Integer focusMinutes, Integer breakMinutes, Integer cycles, String note) {
        PomodoroRecord record = new PomodoroRecord();
        record.setUserId(userId);
        record.setFocusMinutes(focusMinutes);
        record.setBreakMinutes(breakMinutes);
        record.setCycles(cycles);
        record.setNote(note);
        pomodoroMapper.insert(record);
        return record;
    }

    public List<PomodoroRecord> getRecords(Long userId) {
        return pomodoroMapper.findByUserId(userId);
    }

    public int getTotalCycles(Long userId) {
        return pomodoroMapper.countCyclesByUserId(userId);
    }
}
