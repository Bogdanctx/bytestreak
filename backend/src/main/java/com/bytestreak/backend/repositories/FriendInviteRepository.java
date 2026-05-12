package com.bytestreak.backend.repositories;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.FriendInvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FriendInviteRepository extends JpaRepository<FriendInvite, Long> {
    // This query will return all pending invites where the authenticated user is either the sender or the receiver.
    @Query("SELECT fi FROM FriendInvite fi WHERE (fi.sender = :account OR fi.receiver = :account) OR fi.status = 'PENDING'")
    List<FriendInvite> findPendingFriendInvitesOfAccount(Account account);

    FriendInvite findBySenderAndReceiver(Account sender, Account receiver);
}
