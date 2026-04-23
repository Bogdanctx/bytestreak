package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Notification;
import com.bytestreak.backend.enums.NotificationType;
import com.bytestreak.backend.repositories.NotificationRepository;

import java.util.Map;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void send(Account sender, Account receiver, NotificationType type, Map<String, Object> payload) {
        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setReceiver(receiver);
        notification.setType(type);
        notification.setPayload(payload);

        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForAccount(Account account) {
        return notificationRepository.findByReceiverOrderByTimestampDesc(account);
    }
}
