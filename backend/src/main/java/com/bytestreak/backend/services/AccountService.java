package com.bytestreak.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.ScrollPosition;
import org.springframework.data.domain.Window;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bytestreak.backend.RoleUpdateNotificationPayload;
import com.bytestreak.backend.dto.AccountUpdateDTO;
import com.bytestreak.backend.dto.UserProfileDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.enums.NotificationTypes;
import com.bytestreak.backend.enums.Role;
import com.bytestreak.backend.exceptions.ResourceNotFoundException;
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

    @Autowired
    private NotificationService notificationService;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Map<String, Object> fetchAccounts(String query, Long cursor) {
        ScrollPosition position;

        if (cursor == null) {
            position = ScrollPosition.keyset();
        }
        else {
            position = ScrollPosition.of(Map.of("id", cursor), ScrollPosition.Direction.FORWARD);
        }

        Window<Account> window;
        if (query != null && !query.isBlank()) {
            window = accountRepository.findFirst20ByUsernameStartingWithIgnoreCaseOrderByIdAsc(query, position);
        }
        else {
            window = accountRepository.findFirst20ByOrderByIdAsc(position);
        }

        Long nextCursor = null;
        if (!window.isEmpty() && window.hasNext()) {
            nextCursor = window.getContent().get(window.getContent().size() - 1).getId();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("accounts", window.getContent());
        response.put("nextCursor", nextCursor);
        
        return response;    
    }

    public List<Account> fetchLeaderboard() {
        List<Account> leaderboardAccounts;

        leaderboardAccounts = accountRepository.findAllByOrderByCurrentXPDescIdAsc();

        for(int i = 0; i < leaderboardAccounts.size(); i++) {
            Account account = leaderboardAccounts.get(i);
            Long globalRank = accountRepository.calculateGlobalRank(account.getCurrentXP(), account.getId()) + 1;
            account.setGlobalRank(globalRank);
        }

        return leaderboardAccounts;
    }

    public Account updateAccount(Account account, AccountUpdateDTO updates) {
        if (!updates.getUsername().isBlank()) {
            account.setUsername(updates.getUsername());
        }
        if (!updates.getPassword().isBlank()) {
            account.setPassword(passwordEncoder.encode(updates.getPassword()));
        }
        if(!updates.getProfilePictureUrl().isBlank()) {
            account.setProfilePictureUrl(updates.getProfilePictureUrl());
        }
        if(!updates.getEmail().isBlank()) {
            account.setEmail(updates.getEmail());
        }
        if(!updates.getBio().isBlank()) {
            account.setBio(updates.getBio());
        }
        
        Account updated = accountRepository.save(account);
        return updated;
    }

    public UserProfileDTO getUserProfile(Account target) {
        Long globalRank = accountRepository.calculateGlobalRank(target.getCurrentXP(), target.getId()) + 1;
        target.setGlobalRank(globalRank);

        List<Integer> activityGraph = activityTrackerService.getYearlyActivityGraph(target.getId());

        UserProfileDTO userProfile = new UserProfileDTO(
            target, 
            streakRepository.findActiveStreaksForUser(target.getId()),
            activityGraph
        );

        return userProfile;
    }

    public void setUserRole(Account target, String newRole) {
        Role roleEnum = Role.valueOf(newRole.toUpperCase());

        target.setRole(roleEnum);
        accountRepository.save(target);

        RoleUpdateNotificationPayload payload = new RoleUpdateNotificationPayload();
        payload.setMessage("Your role has been updated to " + newRole + ". Permissions and access may have changed accordingly. Please log in again to see the changes.");

        notificationService.sendNotification(target, NotificationTypes.ROLE_UPDATE, payload);
    }
}