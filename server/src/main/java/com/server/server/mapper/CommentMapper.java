package com.server.server.mapper;

import com.server.server.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface CommentMapper {
    List<Comment> findByPostId(@Param("postId") Long postId);
    Comment findById(@Param("id") Long id);
    int insert(Comment comment);
    int deleteById(@Param("id") Long id);
}
