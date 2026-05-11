package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.dto.UserProfileDTO;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.StreakRepository;

import com.bytestreak.backend.entities.Account;

import java.util.List;

@Service
public class ProfileService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private StreakRepository streakRepository;

    @Autowired
    private ActivityTrackerService activityTrackerService;

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
