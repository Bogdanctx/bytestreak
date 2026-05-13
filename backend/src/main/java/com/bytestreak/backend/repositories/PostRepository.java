package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bytestreak.backend.entities.Post;
import com.bytestreak.backend.entities.Account;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    public List<Post> findByAuthor(Account author);
}
