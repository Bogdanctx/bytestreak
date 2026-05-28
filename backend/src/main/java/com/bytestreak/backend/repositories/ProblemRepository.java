package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Window;

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
    Problem findByIsDailyChallangeTrue();
    
    @Query("""
        SELECT p FROM Problem p
        WHERE p.visibility = 'PUBLIC'
        AND (:difficulty IS NULL OR p.difficulty = :difficulty)
        AND (:query IS NULL OR LOWER(p.title) LIKE :query)
        AND (
            :excludeSolved = false OR 
            NOT EXISTS (
                SELECT solvedProblems
                FROM Account a
                JOIN a.solvedProblems solvedProblems
                WHERE a.email = :accountEmail AND solvedProblems.id = p.id
            )
        )
    """)
    Page<Problem> findPublicProblems(
        @Param("difficulty") Difficulty difficulty, 
        @Param("query") String query, 
        @Param("excludeSolved") boolean excludeSolved, 
        @Param("accountEmail") String accountEmail, 
        Pageable pageable
    );
}
