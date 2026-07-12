package com.server.server.service;

import com.server.server.entity.Comment;
import com.server.server.entity.Post;
import com.server.server.mapper.CommentMapper;
import com.server.server.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final PostMapper postMapper;
    private final CommentMapper commentMapper;

    public List<Post> getVisiblePosts() {
        return postMapper.findVisible();
    }

    public List<Post> getAllPosts() {
        return postMapper.findAll();
    }

    public Post getPostById(Long id) {
        return postMapper.findById(id);
    }

    public Post createPost(Long userId, String title, String content, String imageUrl) {
        Post post = new Post();
        post.setUserId(userId);
        post.setTitle(title);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        postMapper.insert(post);
        return postMapper.findById(post.getId());
    }

    public void likePost(Long id) {
        postMapper.incrementLike(id);
    }

    public void deletePost(Long id) {
        postMapper.deleteById(id);
    }

    public void updatePostStatus(Long id, Integer status) {
        Post post = new Post();
        post.setId(id);
        post.setStatus(status);
        postMapper.update(post);
    }

    public List<Comment> getComments(Long postId) {
        return commentMapper.findByPostId(postId);
    }

    public Comment addComment(Long postId, Long userId, String content) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setContent(content);
        commentMapper.insert(comment);
        postMapper.incrementComment(postId);
        // Re-fetch with JOIN to get username/avatar
        return commentMapper.findById(comment.getId());
    }

    public void deleteComment(Long id) {
        commentMapper.deleteById(id);
    }

    public int countAll() {
        return postMapper.countAll();
    }
}
