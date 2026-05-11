package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.dto.UserProfileDTO;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.StreakRepository;

import com.bytestreak.backend.entities.Account;



@Service
public class ProfileService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private StreakRepository streakRepository;

    public UserProfileDTO getUserProfile(String username) {
        Account target = accountRepository.findByUsername(username);

        if (target == null) {
            throw new RuntimeException("User not found");
        }

        UserProfileDTO userProfile = new UserProfileDTO(
            target, 
            streakRepository.findActiveStreaksForUser(target.getId())
        );


        return userProfile;
    }
}
