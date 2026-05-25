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
import com.bytestreak.backend.repositories.FriendshipRepository;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.services.FriendService;
import com.bytestreak.backend.entities.FriendInvite;
import com.bytestreak.backend.entities.Friendship;

import java.util.List;


@RestController
@RequestMapping("/friends")
public class FriendsController {
    @Autowired
    private FriendService friendService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private FriendInviteRepository friendInviteRepository;

    @PostMapping("/send-request")
    public ResponseEntity<?> addFriend(@RequestParam Long friendId, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        Account friend = accountRepository.findById(friendId).orElseThrow(() -> new IllegalArgumentException("Friend not found"));
        
        FriendInvite invite = friendService.sendConnectionRequest(me, friend);

        return ResponseEntity.ok(invite);
    }

    @PostMapping("/respond")
    public ResponseEntity<?> respondToRequest(@RequestParam Long inviteId, @RequestParam Long notificationId, @RequestParam boolean accepted, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());

        if (accepted) {
            friendService.acceptConnectionRequest(me, inviteId, notificationId);
        } 
        else {
            friendService.declineConnectionRequest(me, inviteId, notificationId);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFriend(@RequestParam Long friendId, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        friendService.removeFriend(me, friendId);
        return ResponseEntity.ok().build();
    }

    // This endpoint return the list of pending invites that the authenticated user has sent to other users.
    @GetMapping("/invites/pending-connections")
    public ResponseEntity<?> getPendingInvites(Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());
        List<FriendInvite> friendInvites = friendInviteRepository.findPendingFriendInvitesOfAccount(me);
        return ResponseEntity.ok(friendInvites);
    }   

    @GetMapping("/get-friends")
    public ResponseEntity<?> getFriendsList(@RequestParam Long accountId, Authentication authentication) {
        Account targetAccount = accountRepository.findById(accountId).orElse(null);

        if (targetAccount == null) {
            return ResponseEntity.status(404).body("Account not found");
        }

        List<Friendship> friendships = friendshipRepository.findFriendshipsOfAccount(targetAccount);

        List<Account> friends = friendships.stream()
            .map(friendship -> {
                if (friendship.getAccount1().getId().equals(targetAccount.getId())) {
                    return friendship.getAccount2();
                } else {
                    return friendship.getAccount1();
                }
            })
            .toList();

        return ResponseEntity.ok(friends);
    }

    @GetMapping("/get-friendship")
    public ResponseEntity<?> getFriendship(@RequestParam Long accountId1, @RequestParam Long accountId2, Authentication authentication) {
        Account account1 = accountRepository.findById(accountId1).orElse(null);
        Account account2 = accountRepository.findById(accountId2).orElse(null);

        if (account1 == null || account2 == null) {
            return ResponseEntity.status(404).body("Account not found");
        }

        Friendship friendship = friendshipRepository.findByAccount1AndAccount2(account1, account2);

        if (friendship == null) {
            return ResponseEntity.status(404).body("Friendship not found");
        }

        return ResponseEntity.ok(friendship);
    }
    
}
