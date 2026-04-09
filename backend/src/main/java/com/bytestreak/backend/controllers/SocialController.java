package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.FriendRequestRepository;
import com.bytestreak.backend.repositories.NotificationRepository;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.FriendRequest;
import com.bytestreak.backend.entities.FriendRequestNotification;
import com.bytestreak.backend.entities.Notification;

import java.util.List;

@RestController
@RequestMapping("/social")
public class SocialController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @PostMapping("/friends/add")
    public ResponseEntity<?> addFriend(@RequestParam Long friendId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account sender = accountRepository.findByEmail(authentication.getName());
        Account receiver = accountRepository.findById(friendId).orElse(null);

        if (sender == null || receiver == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request = friendRequestRepository.save(request); // salveaza request-ul

        // creez notificarea si o salvez
        FriendRequestNotification notification = new FriendRequestNotification();
        notification.setReceiver(receiver);
        notification.setSender(sender);
        notification.setFriendRequest(request);
        notificationRepository.save(notification);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account me = accountRepository.findByEmail(authentication.getName());

        if (me == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Notification> notifications = notificationRepository.findByReceiverOrderByTimestampDesc(me);

        return ResponseEntity.ok(notifications);
    }
}