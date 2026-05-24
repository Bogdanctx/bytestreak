package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.enums.Difficulty;
import com.bytestreak.backend.enums.Visibility;


public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByCreatorId(Long creatorId);
    List<Problem> findByDifficulty(Difficulty difficulty);
    List<Problem> findByVisibilityAndDifficulty(Visibility visibility, Difficulty difficulty);
    List<Problem> findByVisibility(Visibility visibility);
    Problem findBySlug(String slug);
    Problem findByIsProblemOfTheDayTrue();
}
