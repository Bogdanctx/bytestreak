package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.bytestreak.backend.entities.Problem;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByCreatorId(Long creatorId);
}
