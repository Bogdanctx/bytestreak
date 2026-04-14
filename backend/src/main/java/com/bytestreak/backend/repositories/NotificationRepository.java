package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Notification;
import com.bytestreak.backend.enums.NotificationType;
import java.util.List;


public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverOrderByTimestampDesc(Account receiver);
    List<Notification> findBySenderAndType(Account sender, NotificationType type);
    List<Notification> findByReceiverAndType(Account receiver, NotificationType type);
}
