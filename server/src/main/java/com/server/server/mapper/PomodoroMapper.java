package com.server.server.mapper;

import com.server.server.entity.PomodoroRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PomodoroMapper {
    List<PomodoroRecord> findByUserId(@Param("userId") Long userId);
    int insert(PomodoroRecord record);
    int countCyclesByUserId(@Param("userId") Long userId);
}
