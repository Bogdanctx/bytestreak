package com.bytestreak.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bytestreak.backend.dto.AccountUpdateDTO;
import com.bytestreak.backend.dto.UserProfileDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.StreakRepository;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private StreakRepository streakRepository;

    @Autowired
    private ActivityTrackerService activityTrackerService;

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
        if(!updates.getBio().isBlank()) {
            me.setBio(updates.getBio());
        }
        
        accountRepository.save(me);

        return me;
    }

    public UserProfileDTO getUserProfile(String username) {
        Account target = accountRepository.findByUsername(username);

        if (target == null) {
            throw new RuntimeException("User not found");
        }

        List<Integer> activityGraph = activityTrackerService.getYearlyActivityGraph(target.getId());

        UserProfileDTO userProfile = new UserProfileDTO(
            target, 
            streakRepository.findActiveStreaksForUser(target.getId()),
            activityGraph
        );


        return userProfile;
    }
}