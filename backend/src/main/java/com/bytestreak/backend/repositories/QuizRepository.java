package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bytestreak.backend.entities.Quiz;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long>  {
    // Custom query to find all quizzes sorted by queuePriority in ascending order
    List<Quiz> findAllByOrderByQueuePriorityAsc();
    Quiz findTopByOrderByQueuePriority();
}
