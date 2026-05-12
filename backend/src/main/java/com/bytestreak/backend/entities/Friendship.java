package com.bytestreak.backend.entities;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "friendships", 
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"account1_id", "account2_id"})
    }
)
@Getter
@Setter
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account1_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account1;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account2_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account account2;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime friendsSince;

    public Friendship(Account account1, Account account2) {
        this.account1 = account1;
        this.account2 = account2;
    }

    public Friendship() {}
}