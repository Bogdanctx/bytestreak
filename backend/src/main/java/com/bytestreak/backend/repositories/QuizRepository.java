package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bytestreak.backend.entities.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long>  {
    
}
