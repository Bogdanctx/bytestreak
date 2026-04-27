package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.FriendInviteRepository;
import com.bytestreak.backend.repositories.NotificationRepository;
import com.bytestreak.backend.FriendRequestNotificationPayload;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.services.FriendService;
import com.bytestreak.backend.entities.FriendInvite;
import com.bytestreak.backend.entities.Notification;

import java.util.List;


@RestController
@RequestMapping("/friends")
public class FriendsController {
    @Autowired
    private FriendService friendService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private FriendInviteRepository friendInviteRepository;

    @PostMapping("/send-request")
    public ResponseEntity<?> addFriend(@RequestParam Long friendId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        Account friend = accountRepository.findById(friendId).orElseThrow(() -> new IllegalArgumentException("Friend not found"));
        
        FriendInvite invite = friendService.sendConnectionRequest(me, friend);

        return ResponseEntity.ok(invite);
    }

    @PostMapping("/respond")
    public ResponseEntity<?> respondToRequest(@RequestParam Long requestId, @RequestParam boolean accepted, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account me = accountRepository.findByEmail(authentication.getName());

        if (accepted) {
            friendService.acceptConnectionRequest(me, requestId);
        } 
        else {
            friendService.declineConnectionRequest(me, requestId);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFriend(@RequestParam Long friendId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        friendService.removeFriend(me, friendId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending-connections")
    public ResponseEntity<?> getPendingConnections(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account me = accountRepository.findByEmail(authentication.getName());

        System.out.println(me);

        List<FriendInvite> pendingConnections = friendService.getPendingConnections(me);
        System.out.println(pendingConnections);

        return ResponseEntity.ok(pendingConnections);
    }

    @GetMapping("/sent-connections")
    public ResponseEntity<?> getSentConnections(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account me = accountRepository.findByEmail(authentication.getName());

        List<FriendInvite> sentConnections = friendService.getSentConnections(me);

        return ResponseEntity.ok(sentConnections);
    }
}
