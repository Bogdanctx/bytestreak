package com.bytestreak.backend;

import lombok.Data;

@Data
public class StreakInviteNotificationPayload implements NotificationPayload {
    private String message;

    // Fields to identify the sender of the streak invite
    private Long senderId;
    private String profilePictureUrl;
    private String username;

    // Field to identify the friend request id
    private Long inviteId;
}
