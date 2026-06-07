package com.bytestreak.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.services.MessageService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.bytestreak.backend.dto.MessageDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Friendship;
import com.bytestreak.backend.entities.Message;
import com.bytestreak.backend.enums.Role;
import com.bytestreak.backend.repositories.FriendshipRepository;
import com.bytestreak.backend.repositories.MessageRepository;

import java.util.List;

@RestController
@RequestMapping("/social/messages")
public class MessageController {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private MessageService messageService;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestParam Long receiverId, @RequestBody MessageDTO payload, Authentication authentication) {
        Account sender = accountRepository.findByEmail(authentication.getName());
        Account receiver = accountRepository.findById(receiverId).orElse(null);

        if (sender == null || receiver == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if sender and receiver are friends
        List<Friendship> friendships = friendshipRepository.findFriendshipsOfAccount(sender);
        boolean isFriendWithReceiver = false;
        for(Friendship friendship: friendships) {
            if (friendship.getAccount1().getId() == receiver.getId() || friendship.getAccount2().getId() == receiver.getId()) {
                isFriendWithReceiver = true;
                break;
            }
        }

        if (!isFriendWithReceiver) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only send messages to friends.");
        }

        Message sentMessage = messageService.sendMessage(sender, receiver, payload);

        return ResponseEntity.ok(sentMessage);
    }

    @GetMapping("/conversation")
    public ResponseEntity<?> getConversation(@RequestParam Long otherUserId, Authentication authentication) {
        Account currentUser = accountRepository.findByEmail(authentication.getName());
        Account otherUser = accountRepository.findById(otherUserId).orElse(null);

        if (currentUser == null || otherUser == null) {
            return ResponseEntity.notFound().build();
        }

        List<Message> conversation = messageService.getConversation(currentUser, otherUser);

        return ResponseEntity.ok(conversation);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long messageId, Authentication authentication) {
        Account currentUser = accountRepository.findByEmail(authentication.getName());
        Message message = messageRepository.findById(messageId).orElse(null);

        if (message == null) {
            return ResponseEntity.notFound().build();
        }

        System.out.println("[LOGS] User " + currentUser.getEmail() + " is attempting to delete message with ID: " + messageId);

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isModerator = currentUser.getRole() == Role.MODERATOR;

        if (!isAdmin && !isModerator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete messages if you are an admin or moderator.");
        }

        messageRepository.delete(message);
        return ResponseEntity.ok("Message deleted successfully");
    }
}