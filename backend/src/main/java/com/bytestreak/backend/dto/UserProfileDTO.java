package com.bytestreak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Streak;

@Data
@AllArgsConstructor
public class UserProfileDTO {
    Account account;
    List<Streak> streaks;
}
