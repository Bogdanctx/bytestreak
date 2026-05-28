package com.bytestreak.backend;

import lombok.Data;

@Data
public class SeasonEndNotificationPayload implements NotificationPayload {
    private String message;
}
