package com.bytestreak.backend;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "payloadType"
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = FriendRequestNotificationPayload.class, name = "FRIEND_REQUEST"),
    @JsonSubTypes.Type(value = StreakInviteNotificationPayload.class, name = "STREAK_INVITE")
})
public interface NotificationPayload {
    
}
