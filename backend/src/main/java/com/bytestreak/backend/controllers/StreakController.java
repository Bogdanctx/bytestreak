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
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be authenticated to view active streaks.");
        }

        Account me = accountRepository.findByEmail(authentication.getName());

        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found.");
        }
        
        List<Streak> streaks = streakRepository.findActiveStreaksForUser(me.getId());
        return ResponseEntity.ok(streaks);
    }

    @PostMapping("/respond")
    public ResponseEntity<?> respondToStreakInvite(@RequestParam Long inviteId, @RequestParam Long notificationId, @RequestParam boolean accepted, Authentication authentication) {
        // Validate authentication
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be authenticated to respond to streak invites.");
        }

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
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be authenticated to invite friends to a streak.");
        }

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
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be authenticated to view sent streak invites.");
        }

        Account me = accountRepository.findByEmail(authentication.getName());

        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found.");
        }

        List<StreakInvite> activeInvites = streakInviteRepository.findBySenderOrReceiver(me, me);
        return ResponseEntity.ok(activeInvites);
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeStreak(@RequestParam Long streakId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be authenticated to remove a streak.");
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        Streak streak = streakRepository.findById(streakId).orElse(null);

        if (streak == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Streak not found.");
        }

        Account participant1 = streak.getParticipant1();
        Account participant2 = streak.getParticipant2();

        if (!participant1.getId().equals(me.getId()) && !participant2.getId().equals(me.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only remove streaks you are a participant of.");
        }

        streakService.removeStreakBetweenUsers(participant1, participant2);
        return ResponseEntity.ok().build();
    }
}
