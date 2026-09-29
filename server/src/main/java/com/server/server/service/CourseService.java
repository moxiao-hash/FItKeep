package com.server.server.service;

import com.server.server.entity.Course;
import com.server.server.entity.Video;
import com.server.server.mapper.CourseMapper;
import com.server.server.mapper.VideoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseMapper courseMapper;
    private final VideoMapper videoMapper;

    public List<Course> getPublishedCourses(String category) {
        return courseMapper.findPublished(category);
    }

    public List<Course> getAllCourses(String category, Integer difficulty) {
        return courseMapper.findAll(category, difficulty);
    }

    public Map<String, Object> getCourseDetail(Long id) {
        Course course = courseMapper.findById(id);
        if (course == null || course.getStatus() == null || course.getStatus() != 1) {
            throw new RuntimeException("课程不存在或未发布");
        }
        courseMapper.incrementViewCount(id);
        List<Video> videos = videoMapper.findByCourseId(id);
        Map<String, Object> res = new HashMap<>();
        res.put("course", course);
        res.put("videos", videos);
        return res;
    }

    public void createCourse(Course course) {
        course.setStatus(1);
        courseMapper.insert(course);
    }

    public void updateCourse(Course course) {
        courseMapper.update(course);
    }

    public void deleteCourse(Long id) {
        videoMapper.deleteByCourseId(id);
        courseMapper.deleteById(id);
    }

    public void addVideo(Video video) {
        videoMapper.insert(video);
    }

    public void deleteVideo(Long id) {
        videoMapper.deleteById(id);
    }

    public List<Video> getVideosByCourse(Long courseId) {
        Course course = courseMapper.findById(courseId);
        if (course == null || course.getStatus() == null || course.getStatus() != 1) {
            throw new RuntimeException("课程不存在或未发布");
        }
        return videoMapper.findByCourseId(courseId);
    }

    public int countAll() {
        return courseMapper.countAll();
    }
}
