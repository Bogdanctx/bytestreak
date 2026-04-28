package com.bytestreak.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.services.MessageService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.bytestreak.backend.dto.MessageDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Message;

@RestController
@RequestMapping("/social/messages")
public class MessageController {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestParam Long receiverId, @RequestBody MessageDTO payload, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Account sender = accountRepository.findByEmail(authentication.getName());
        Account receiver = accountRepository.findById(receiverId).orElse(null);

        if (sender == null || receiver == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Message sentMessage = messageService.sendMessage(sender, receiver, payload);

        return ResponseEntity.ok(sentMessage);
    }

    @GetMapping("/conversation")
    public ResponseEntity<?> getConversation(@RequestParam Long otherUserId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Account currentUser = accountRepository.findByEmail(authentication.getName());
        Account otherUser = accountRepository.findById(otherUserId).orElse(null);

        if (currentUser == null || otherUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(messageService.getConversation(currentUser, otherUser));
    }
}