package com.bytestreak.backend.repositories;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.StreakInvite;
import com.bytestreak.backend.enums.InviteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StreakInviteRepository extends JpaRepository<StreakInvite, Long> {
    boolean existsBySenderAndReceiverAndStatus(Account sender, Account receiver, InviteStatus status);
    List<StreakInvite> findBySenderAndStatus(Account sender, InviteStatus status);
}