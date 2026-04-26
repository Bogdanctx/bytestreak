package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Streak;
import com.bytestreak.backend.entities.StreakInvite;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.services.AccountService;
import com.bytestreak.backend.services.StreakService;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/streaks")
public class StreakController {
    @Autowired
    private StreakService streakService;

    @Autowired
    private AccountRepository accountRepository;
    
    @GetMapping("/active")
    public List<Streak> getActiveStreaks(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return List.of();
        }

        return streakService.getActiveStreaks(authentication);
    }

    @PostMapping("/invite")
    public ResponseEntity<?> inviteToStreak(@RequestParam Long friendId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        streakService.inviteToStreak(friendId, authentication);
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending-invites")
    public ResponseEntity<?> getPendingInvites(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Account account = accountRepository.findByEmail(authentication.getName());

        List<StreakInvite> pendingInvites = streakService.getPendingInvites(account);
        
        return ResponseEntity.ok(pendingInvites);
    }
    
    
}
