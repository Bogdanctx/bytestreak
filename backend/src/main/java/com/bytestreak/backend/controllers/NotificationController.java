package com.bytestreak.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bytestreak.backend.services.NotificationService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.entities.Account;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/fetch")
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = accountRepository.findByEmail(authentication.getName());
        return ResponseEntity.ok(notificationService.getNotificationsForAccount(account));
    }

    @PostMapping("/mark-as-read")
    public ResponseEntity<?> markNotificationsAsRead(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = accountRepository.findByEmail(authentication.getName());
        notificationService.markNotificationsAsRead(account);
        return ResponseEntity.ok().build();
    }
    
}
