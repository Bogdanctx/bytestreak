package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.entities.Account;

@RestController
@RequestMapping("/social")
public class SocialController {
    private final AccountRepository accountRepository;

    public SocialController(AccountRepository accountRepository) 
    {
        this.accountRepository = accountRepository;
    }

    @PostMapping("/friends/add")
    public ResponseEntity<?> addFriend(@RequestParam Long friendId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = accountRepository.findByEmail(authentication.getName());
        Account friend = accountRepository.findById(friendId).orElse(null);

        if (account == null || friend == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        account.getFriends().add(friend);
        accountRepository.save(account);

        return ResponseEntity.ok().build();
    }
}