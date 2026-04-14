package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Notification;
import java.util.List;


public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findBySenderOrderByTimestampDesc(Account sender);
}
