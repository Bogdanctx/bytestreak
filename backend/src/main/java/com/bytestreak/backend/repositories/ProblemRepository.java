package com.bytestreak.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByCreatorId(Long creatorId);
}
