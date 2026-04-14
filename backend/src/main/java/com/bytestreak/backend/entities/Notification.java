package com.bytestreak.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import com.bytestreak.backend.enums.NotificationType;

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

import java.util.Map;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Getter @Setter
    private Account receiver;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @Getter @Setter
    private Account sender;

    @Enumerated(EnumType.STRING)
    @Getter @Setter
    private NotificationType type;

    @Getter @Setter
    private boolean isRead = false;

    @CreationTimestamp
    @Getter
    private LocalDateTime timestamp;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Getter @Setter
    private Map<String, Object> payload;
}
