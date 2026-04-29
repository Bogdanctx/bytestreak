package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bytestreak.backend.entities.StreakInvite;
import com.bytestreak.backend.entities.Account;
import java.util.List;

public interface StreakInviteRepository extends JpaRepository<StreakInvite, Long> {
    List<StreakInvite> findBySenderId(Long senderId);
    List<StreakInvite> findBySenderOrReceiver(Account sender, Account receiver);
    
    @Query("SELECT si FROM StreakInvite si WHERE (si.sender = :account1 AND si.receiver = :account2) OR (si.sender = :account2 AND si.receiver = :account1)")
    StreakInvite findByAccount1AndAccount2(Account account1, Account account2);
}
