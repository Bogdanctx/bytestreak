package com.bytestreak.backend;

import lombok.Data;

import com.bytestreak.backend.entities.Account;

@Data
public class StreakInviteNotificationPayload implements NotificationPayload {
    private Account sender;
    private String message;
}
