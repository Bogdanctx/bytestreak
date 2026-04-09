package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bytestreak.backend.entities.FriendRequest;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.enums.FriendRequestStatus;

import java.util.List;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findByReceiverAndStatus(Account receiver, FriendRequestStatus status);
    
}
