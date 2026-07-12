package com.server.server.mapper;

import com.server.server.entity.Course;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface CourseMapper {
    List<Course> findAll(@Param("category") String category, @Param("difficulty") Integer difficulty);
    List<Course> findPublished(@Param("category") String category);
    Course findById(@Param("id") Long id);
    int insert(Course course);
    int update(Course course);
    int deleteById(@Param("id") Long id);
    int incrementViewCount(@Param("id") Long id);
    int countAll();
}
