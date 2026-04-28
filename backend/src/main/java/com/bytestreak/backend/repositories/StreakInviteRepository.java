package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bytestreak.backend.entities.StreakInvite;
import com.bytestreak.backend.entities.Account;
import java.util.List;

public interface StreakInviteRepository extends JpaRepository<StreakInvite, Long> {
    List<StreakInvite> findBySenderId(Long senderId);
    List<StreakInvite> findBySenderOrReceiver(Account sender, Account receiver);
    StreakInvite findBySenderAndReceiver(Account sender, Account receiver);
}
