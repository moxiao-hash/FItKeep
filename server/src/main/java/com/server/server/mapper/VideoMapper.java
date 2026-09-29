package com.server.server.mapper;

import com.server.server.entity.Video;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface VideoMapper {
    List<Video> findByCourseId(@Param("courseId") Long courseId);
    Video findById(@Param("id") Long id);
    int countPublishedByUrl(@Param("url") String url);
    int insert(Video video);
    int update(Video video);
    int deleteById(@Param("id") Long id);
    int deleteByCourseId(@Param("courseId") Long courseId);
}
