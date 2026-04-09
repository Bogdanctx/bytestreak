package com.bytestreak.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import com.bytestreak.backend.enums.FriendRequestStatus;

@Entity
public class FriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @Getter @Setter
    private Account sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    @Getter @Setter
    private Account receiver;

    @Enumerated(EnumType.STRING)
    @Getter @Setter
    private FriendRequestStatus status = FriendRequestStatus.PENDING;

    @CreationTimestamp
    @Getter
    private LocalDateTime createdAt;
}
