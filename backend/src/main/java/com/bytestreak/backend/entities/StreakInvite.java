package com.bytestreak.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.bytestreak.backend.enums.InviteStatus;

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

@Entity
@Getter
@Setter
public class StreakInvite {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private Account sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private Account receiver;

    @Enumerated(EnumType.STRING)
    private InviteStatus status;

    @CreationTimestamp
    private LocalDateTime timestamp;
}
