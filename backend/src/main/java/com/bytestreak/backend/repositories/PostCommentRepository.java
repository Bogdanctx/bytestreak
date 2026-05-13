package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bytestreak.backend.entities.PostComment;

import java.util.List;

public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    public List<PostComment> findByPostId(Long postId);
}
