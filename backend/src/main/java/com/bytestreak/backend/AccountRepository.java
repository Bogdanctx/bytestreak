package com.bytestreak.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);
    List<Account> findByIdGreaterThanOrderByIdAsc(Long id, Pageable pageable);
}
