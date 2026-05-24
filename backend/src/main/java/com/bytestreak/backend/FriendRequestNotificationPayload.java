package com.bytestreak.backend;

import lombok.Data;

@Data
public class FriendRequestNotificationPayload implements NotificationPayload {
    private String message;

    // Fields to identify the sender of the friend request
    private Long senderId;
    private String profilePictureUrl;
    private String cssEffectStyle;
    private String username;

    // Field to identify the friend request id
    private Long inviteId;
}