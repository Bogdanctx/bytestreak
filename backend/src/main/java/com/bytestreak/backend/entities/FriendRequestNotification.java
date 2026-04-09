package com.bytestreak.backend.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("FRIEND_REQUEST")
@Table(name = "friend_request_notifications")
public class FriendRequestNotification extends Notification {
    @ManyToOne
    @Getter @Setter
    private Account sender;

    @ManyToOne
    @JoinColumn(name = "friend_request_id", nullable = false)
    @Getter @Setter
    private FriendRequest friendRequest;
}
