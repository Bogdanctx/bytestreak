package com.bytestreak.backend.controllers;

import com.bytestreak.backend.services.StreakService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.StreakInviteRepository;
import com.bytestreak.backend.entities.StreakInvite;
import com.bytestreak.backend.repositories.StreakRepository;
import com.bytestreak.backend.entities.Streak;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;



@RestController
@RequestMapping("/streaks")
public class StreakController {
    @Autowired
    private StreakService streakService;
    
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private StreakInviteRepository streakInviteRepository;

    @Autowired
    private StreakRepository streakRepository;

    @GetMapping("/fetch-streaks")
    public ResponseEntity<?> getActiveStreaks(Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());

        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found.");
        }
        
        List<Streak> streaks = streakRepository.findActiveStreaksForUser(me.getId());
        return ResponseEntity.ok(streaks);
    }

    @PostMapping("/respond")
    public ResponseEntity<?> respondToStreakInvite(@RequestParam Long inviteId, @RequestParam Long notificationId, @RequestParam boolean accepted, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found.");
        }

        StreakInvite invite = streakInviteRepository.findById(inviteId).orElse(null);
        if (invite == null || !invite.getReceiver().getId().equals(me.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Streak invite not found or user is not the recipient.");
        }

        if (accepted) {
            streakService.acceptStreakInvite(me, inviteId, notificationId);
        } else {
            streakService.declineStreakInvite(me, inviteId, notificationId);
        }

        return ResponseEntity.ok().build();
    }
    
    
    @PostMapping("/invite")
    public ResponseEntity<?> inviteFriendToStreak(@RequestParam Long friendId, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());

        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found.");
        }

        Account friend = accountRepository.findById(friendId).orElse(null);

        if (friend == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Friend not found.");
        }

        StreakInvite invite = streakService.inviteFriendToStreak(me, friend);
        return ResponseEntity.ok(invite);
    }

    @GetMapping("/active-invites")
    public ResponseEntity<?> getActiveInvites(Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());

        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found.");
        }

        List<StreakInvite> activeInvites = streakInviteRepository.findBySenderOrReceiver(me, me);
        return ResponseEntity.ok(activeInvites);
    }

    @DeleteMapping("/delete-streak")
    public ResponseEntity<?> removeStreak(@RequestParam Long streakId, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        Streak streak = streakRepository.findById(streakId).orElse(null);

        if (streak == null) {
            return ResponseEntity.ok().build(); // if the streak doesn't exist, we can consider it removed for idempotency
        }

        Account participant1 = streak.getParticipant1();
        Account participant2 = streak.getParticipant2();

        if (!participant1.getId().equals(me.getId()) && !participant2.getId().equals(me.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only remove streaks you are a participant of.");
        }

        streakService.removeStreakBetweenUsers(participant1, participant2);
        return ResponseEntity.ok().build();
    }

    @PostMapping("save-streak")
    public ResponseEntity<?> saveStreak(@RequestParam Long streakId, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
    
        try {
            streakService.saveStreakOfUser(me);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}