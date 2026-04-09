package com.bytestreak.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Transient;

import lombok.Getter;
import lombok.Setter;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "notification_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter 
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    @Getter @Setter 
    private Account receiver;

    @Getter @Setter
    private boolean isRead = false;

    @CreationTimestamp
    @Getter 
    private LocalDateTime timestamp;

    @Transient
    @JsonProperty("type")
    public String getType() {
        DiscriminatorValue discriminatorValue = this.getClass().getAnnotation(DiscriminatorValue.class);
        if (discriminatorValue == null) {
            return "UNKNOWN";
        }

        return discriminatorValue.value();
    }
}