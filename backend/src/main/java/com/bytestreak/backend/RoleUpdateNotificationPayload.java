package com.bytestreak.backend;

import lombok.Data;

@Data
public class RoleUpdateNotificationPayload implements NotificationPayload {
    private String message;
}