package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.ScrollPosition;
import org.springframework.data.domain.Window;

import com.bytestreak.backend.entities.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);
    
    // get all accounts by using cursor-based pagination
    Window<Account> findFirst20ByOrderByIdAsc(ScrollPosition position);

    // get all accounts with cursor and optional search query
    Window<Account> findFirst20ByUsernameStartingWithIgnoreCaseOrderByIdAsc(String username, ScrollPosition position);

    Account findByUsername(String username);


    // for leaderboard
    Page<Account> findAllByOrderByCurrentXPDescIdAsc(Pageable pageable);
    Page<Account> findByUsernameStartingWithIgnoreCaseOrderByCurrentXPDescIdAsc(String username, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Account a WHERE a.currentXP > :xp OR (a.currentXP = :xp AND a.id < :id)")
    Long calculateGlobalRank(@Param("xp") Integer xp, @Param("id") Long id);
}
