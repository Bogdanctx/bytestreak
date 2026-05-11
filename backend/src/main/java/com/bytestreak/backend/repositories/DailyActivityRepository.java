// src/main/java/com/bytestreak/backend/repositories/DailyActivityRepository.java
package com.bytestreak.backend.repositories;

import com.bytestreak.backend.entities.DailyActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyActivityRepository extends JpaRepository<DailyActivity, Long> {
    Optional<DailyActivity> findByAccountIdAndActivityDate(Long accountId, LocalDate date);
    @Query("SELECT d FROM DailyActivity d WHERE d.account.id = :accountId AND d.activityDate >= :startDate ORDER BY d.activityDate ASC")
    List<DailyActivity> findRecentActivity(@Param("accountId") Long accountId, @Param("startDate") LocalDate startDate);
}