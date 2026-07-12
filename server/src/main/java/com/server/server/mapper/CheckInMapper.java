package com.server.server.mapper;

import com.server.server.entity.CheckIn;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDate;
import java.util.List;

@Mapper
public interface CheckInMapper {
    List<CheckIn> findByUserId(@Param("userId") Long userId);
    List<CheckIn> findAll();
    CheckIn findByUserIdAndDate(@Param("userId") Long userId, @Param("checkDate") LocalDate checkDate);
    int insert(CheckIn checkIn);
    int deleteById(@Param("id") Long id);
    int countByUserId(@Param("userId") Long userId);
    int countAll();
}
