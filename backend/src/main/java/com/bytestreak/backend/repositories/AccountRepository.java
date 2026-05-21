package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import java.util.List;

import com.bytestreak.backend.entities.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);
    List<Account> findByIdGreaterThanOrderByIdAsc(Long id, Pageable pageable);
    List<Account> findByUsernameStartingWithIgnoreCase(String username, Pageable pageable);
    Account findByUsername(String username);

    Page<Account> findAllByOrderByCurrentXPDesc(Pageable pageable);
    Page<Account> findByUsernameStartingWithIgnoreCaseOrderByCurrentXPDesc(String username, Pageable pageable);
    Long countByCurrentXPGreaterThan(Integer currentXP);
}
