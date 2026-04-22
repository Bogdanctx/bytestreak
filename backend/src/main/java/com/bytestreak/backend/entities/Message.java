package com.bytestreak.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;

@Entity
@Getter
@Setter
@Table(name = "Messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private Account sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private Account receiver;

    private String text;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL)
    private List<Attachment> attachments = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime timestamp;
}
