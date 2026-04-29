package com.bytestreak.backend.repositories;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.FriendInvite;
import com.bytestreak.backend.enums.InviteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendInviteRepository extends JpaRepository<FriendInvite, Long> {
    List<FriendInvite> findByReceiverAndStatus(Account receiver, InviteStatus status);
    List<FriendInvite> findBySenderAndStatus(Account sender, InviteStatus status);
    FriendInvite findBySenderAndReceiver(Account sender, Account receiver);
}
