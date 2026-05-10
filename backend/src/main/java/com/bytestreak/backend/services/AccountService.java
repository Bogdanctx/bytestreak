package com.bytestreak.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collections;

import com.bytestreak.backend.dto.AccountUpdateDTO;
import com.bytestreak.backend.dto.UserProfileDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Map<String, Object> fetchAccountsWithCursor(String query, Long cursor, String authenticatedUserEmail) {
        int pageSize = 20;
        Long startId = (cursor == null) ? 0L : cursor;
        List<Account> accounts;

        if (query == null || query.isBlank()) {
            accounts = accountRepository.findByIdGreaterThanOrderByIdAsc(startId, PageRequest.of(0, pageSize));
        } 
        else {
            accounts = accountRepository.findByUsernameStartingWithIgnoreCase(query, PageRequest.of(0, pageSize));
        }

        Long nextCursor = null;
        if (!accounts.isEmpty() && accounts.size() == pageSize) {
            nextCursor = accounts.get(accounts.size() - 1).getId();
        }

        Account me = accountRepository.findByEmail(authenticatedUserEmail);
        accounts.removeIf(account -> account.getId().equals(me.getId()));

        Map<String, Object> response = new HashMap<>();
        response.put("accounts", accounts);
        response.put("nextCursor", nextCursor);

        return response;
    }

    public Account updateAccount(AccountUpdateDTO updates, Authentication authentication) {
        Account me = accountRepository.findByEmail(authentication.getName());

        if (me == null) {
            throw new RuntimeException("User not found");
        }
        if (!updates.getUsername().isBlank()) {
            me.setUsername(updates.getUsername());
        }
        if (!updates.getPassword().isBlank()) {
            me.setPassword(passwordEncoder.encode(updates.getPassword()));
        }
        if(!updates.getProfilePictureUrl().isBlank()) {
            me.setProfilePictureUrl(updates.getProfilePictureUrl());
        }
        if(!updates.getEmail().isBlank()) {
            me.setEmail(updates.getEmail());
        }
        
        accountRepository.save(me);

        return me;
    }

    public UserProfileDTO getProfileData(String targetUsername, String currentEmail) {
        Account targetAccount = accountRepository.findByUsername(targetUsername);

        if (targetAccount == null) {
            throw new RuntimeException("Profile not found");
        }

        // 1. Identify the current user (the one looking at the profile)
        Account currentUser = null;
        if (currentEmail != null) {
            currentUser = accountRepository.findByEmail(currentEmail);
        }

        // --- TODO: REPLACE THESE WITH REAL REPOSITORY CALLS LATER ---
        // boolean isFriend = friendRepository.checkIfFriends(currentUser.getId(), targetAccount.getId());
        // int streak = streakRepository.getActiveStreak(currentUser.getId(), targetAccount.getId());
        // -----------------------------------------------------------

        // MOCK LOGIC FOR NOW: Assume they are friends if they are logged in and looking at someone else
        boolean isFriend = currentUser != null && !currentUser.getUsername().equals(targetUsername);
        int mockStreak = isFriend ? 14 : 0;

        // Generate 365 days of mock activity for the GitHub graph
        List<Integer> mockActivity = new ArrayList<>(Collections.nCopies(365, 0));
        for(int i = 0; i < 60; i++) {
            mockActivity.set((int)(Math.random() * 365), (int)(Math.random() * 5));
        }

        // Default avatar generation based on username string
        String generatedAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + targetAccount.getUsername();

        return new UserProfileDTO(
                targetAccount.getUsername(),
                generatedAvatar,
                10,             // Mock Level
                "Silver II",    // Mock Rank
                150,            // Mock Coins
                24,             // Mock Friends Count
                87,             // Mock Problems Solved
                12,             // Mock Quizzes
                isFriend,
                mockStreak,
                mockActivity
        );
    }

}