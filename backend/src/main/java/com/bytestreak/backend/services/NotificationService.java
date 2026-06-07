package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bytestreak.backend.NotificationPayload;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Notification;
import com.bytestreak.backend.enums.NotificationTypes;
import com.bytestreak.backend.repositories.NotificationRepository;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public Notification sendNotification(Account receiver, NotificationTypes type, NotificationPayload payload) {
        Notification notification = new Notification();
        notification.setReceiver(receiver);
        notification.setType(type);
        notification.setPayload(payload);

        notificationRepository.save(notification);
        return notification;
    }

    public void markNotificationsAsRead(Account account) {
        List<Notification> notifications = notificationRepository.findByReceiverOrderByTimestampDesc(account);
        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
                notificationRepository.save(notification);
            }
        }
    }

    @Transactional
    public void deleteNotifications(Account account) {
        notificationRepository.deleteAll(notificationRepository.findByReceiverOrderByTimestampDesc(account));
    }

    public List<Notification> getNotificationsForAccount(Account account) {
        return notificationRepository.findByReceiverOrderByTimestampDesc(account);
    }
}
