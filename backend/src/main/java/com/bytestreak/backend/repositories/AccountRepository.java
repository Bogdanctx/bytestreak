package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.ScrollPosition;
import org.springframework.data.domain.Window;
import org.springframework.data.domain.Page;

import com.bytestreak.backend.entities.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);
    
    // get all accounts by using cursor-based pagination
    Window<Account> findFirst20ByOrderByIdAsc(ScrollPosition position);

    // get all accounts with cursor and optional search query
    Window<Account> findFirst20ByUsernameStartingWithIgnoreCaseOrderByIdAsc(String username, ScrollPosition position);

    Account findByUsername(String username);

    Page<Account> findAllByOrderByCurrentXPDesc(Pageable pageable);
    Page<Account> findByUsernameStartingWithIgnoreCaseOrderByCurrentXPDesc(String username, Pageable pageable);
    Long countByCurrentXPGreaterThan(Integer currentXP);
}
