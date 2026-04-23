package com.bytestreak.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bytestreak.backend.services.NotificationService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Notification;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping
    public List<Notification> getNotifications(Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        return notificationService.getNotificationsForAccount(me);
    }
}
