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
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.services.FriendService;

@RestController
@RequestMapping("/friends")
public class FriendsController {
    @Autowired
    private FriendService friendService;

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addConnection(@RequestParam Long friendId, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        
        friendService.sendConnectionRequest(me, friendId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept")
    public ResponseEntity<?> acceptConnection(@RequestParam Long requestId, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        friendService.acceptConnectionRequest(me, requestId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/decline")
    public ResponseEntity<?> declineConnection(@RequestParam Long requestId, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        friendService.declineConnectionRequest(me, requestId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFriend(@RequestParam Long friendId, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        friendService.removeFriend(me, friendId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingConnections(Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        return ResponseEntity.ok(friendService.getPendingConnections(me));
    }
}
