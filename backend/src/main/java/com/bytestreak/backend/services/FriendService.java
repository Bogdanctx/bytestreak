package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.NotificationRepository;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Notification;
import com.bytestreak.backend.enums.NotificationType;

import java.util.Map;
import java.util.List;

@Service
public class FriendService {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AccountRepository accountRepository;

    public void sendConnectionRequest(Account sender, Long receiverId) {
        if (sender.getId().equals(receiverId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        Account receiver = accountRepository.findById(receiverId).orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        notificationService.send(sender, receiver, NotificationType.FRIEND_REQUEST, Map.of());
    }

    public void acceptConnectionRequest(Account me, Long notificationId) {
        Notification notification = notificationRepository
                                    .findById(notificationId)
                                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!notification.getReceiver().getId().equals(me.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        Account sender = notification.getSender();

        notificationRepository.delete(notification);

        me.getFriends().add(sender);
        sender.getFriends().add(me);

        accountRepository.save(me);
        accountRepository.save(sender);
    }

    public void declineConnectionRequest(Account me, Long notificationId) {
        Notification notification = notificationRepository
                                    .findById(notificationId)
                                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        if (!notification.getReceiver().getId().equals(me.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        notificationRepository.delete(notification);
    }

    public void removeFriend(Account me, Long friendId) {
        Account friend = accountRepository
                            .findById(friendId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        me.getFriends().removeIf(a -> a.getId().equals(friendId));
        friend.getFriends().removeIf(a -> a.getId().equals(me.getId()));

        accountRepository.save(me);
        accountRepository.save(friend);
    }

    public List<Notification> getPendingConnections(Account me) {
        List<Notification> pendingRequests = notificationRepository.findBySenderAndType(me, NotificationType.FRIEND_REQUEST);
        List<Notification> incomingRequests = notificationRepository.findByReceiverAndType(me, NotificationType.FRIEND_REQUEST);

        pendingRequests.addAll(incomingRequests);

        return pendingRequests;
    }
}
