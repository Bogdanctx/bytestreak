package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Notification;
import com.bytestreak.backend.enums.NotificationType;
import com.bytestreak.backend.repositories.NotificationRepository;

import java.util.List;

@RestController
@RequestMapping("/social")
public class SocialController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private NotificationRepository notificationRepository;

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

        Notification notification = new Notification();
        notification.setSender(sender);
        notification.setReceiver(receiver);
        notification.setType(NotificationType.FRIEND_REQUEST);
        notification.setPayload(null);

        notificationRepository.save(notification);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/friends/accept")
    public ResponseEntity<?> acceptFriendRequest(@RequestParam Long requestId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        Notification notification = notificationRepository.findById(requestId).orElse(null);

        if (me == null || notification == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (notification.getReceiver() != me) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        notificationRepository.delete(notification);
        me.getFriends().add(notification.getSender());
        accountRepository.save(me);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/friends/decline")
    public ResponseEntity<?> declineFriendRequest(@RequestParam Long requestId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        Notification notification = notificationRepository.findById(requestId).orElse(null);

        if (me == null || notification == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (notification.getReceiver() != me) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        notificationRepository.delete(notification);

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