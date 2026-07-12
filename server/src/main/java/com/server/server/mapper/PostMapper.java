package com.server.server.mapper;

import com.server.server.entity.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PostMapper {
    List<Post> findAll();
    List<Post> findVisible();
    Post findById(@Param("id") Long id);
    List<Post> findByUserId(@Param("userId") Long userId);
    int insert(Post post);
    int update(Post post);
    int deleteById(@Param("id") Long id);
    int incrementLike(@Param("id") Long id);
    int incrementComment(@Param("id") Long id);
    int countAll();
}
