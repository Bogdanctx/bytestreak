package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    
    @Query("SELECT p FROM Problem p WHERE p.visibility = :visibility AND LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) AND (:cursor IS NULL OR p.id > :cursor) ORDER BY p.id ASC LIMIT 21")
    List<Problem> findPublicProblemsByTitleWithCursor(@Param("visibility") Visibility visibility, @Param("query") String query, @Param("cursor") Long cursor);
    
    @Query("SELECT p FROM Problem p WHERE p.visibility = :visibility AND p.difficulty = :difficulty AND LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) AND (:cursor IS NULL OR p.id > :cursor) ORDER BY p.id ASC LIMIT 21")
    List<Problem> findPublicProblemsByTitleAndDifficultyWithCursor(@Param("visibility") Visibility visibility, @Param("difficulty") Difficulty difficulty, @Param("query") String query, @Param("cursor") Long cursor);
}
