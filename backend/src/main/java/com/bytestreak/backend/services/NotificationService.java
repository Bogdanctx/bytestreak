package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Notification;
import com.bytestreak.backend.repositories.NotificationRepository;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(Account receiver, String message) {
        Notification notification = new Notification();
        notification.setReceiver(receiver);
        notification.setMessage(message);

        notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForAccount(Account account) {
        return notificationRepository.findByReceiverOrderByTimestampDesc(account);
    }
}
