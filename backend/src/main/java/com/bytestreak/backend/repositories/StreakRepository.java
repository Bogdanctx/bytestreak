package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Streak;

public interface StreakRepository extends JpaRepository<Streak, Long> {
    List<Streak> findByAccount1OrAccount2(Account account1, Account account2);
}
