package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;

import com.bytestreak.backend.entities.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);
    List<Account> findByIdGreaterThanOrderByIdAsc(Long id, Pageable pageable);
}
