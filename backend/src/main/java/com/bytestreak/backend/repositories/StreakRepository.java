package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bytestreak.backend.entities.Streak;

import com.bytestreak.backend.entities.Account;

import java.util.List;

public interface StreakRepository extends JpaRepository<Streak, Long> {
    @Query("SELECT s FROM Streak s WHERE s.participant1.id = :userId OR s.participant2.id = :userId")
    List<Streak> findActiveStreaksForUser(@Param("userId") Long userId);

    @Query("SELECT s FROM Streak s WHERE (s.participant1 = :acc1 AND s.participant2 = :acc2) OR (s.participant1 = :acc2 AND s.participant2 = :acc1)")
    Streak findStreakBetweenUsers(@Param("acc1") Account acc1, @Param("acc2") Account acc2);
}
