package com.bytestreak.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import lombok.Getter;
import lombok.Setter;

enum NotificationType {
    FRIEND_REQUEST
}

@Entity
public abstract class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    @Getter @Setter private Account receiver;

    @Enumerated(EnumType.STRING)
    @Getter @Setter private NotificationType type;
    @Getter @Setter private Long timestamp = System.currentTimeMillis();
}