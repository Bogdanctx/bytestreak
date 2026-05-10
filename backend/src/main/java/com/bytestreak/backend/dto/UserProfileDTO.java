package com.bytestreak.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileDTO {
    private String username;
    private String avatarUrl;
    private int level;
    private String rank;
    private int coins;
    private int friendsCount;
    private int problemsSolved;
    private int quizzesSolved;
    private boolean isFriend;
    private int streakLength;
    private List<Integer> activityHistory;
}