package com.bytestreak.backend.entities;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;

@Table
@Entity
@Getter
@Setter
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account1_id")
    private Account account1;
    
    @ManyToOne
    @JoinColumn(name = "account2_id")
    private Account account2;
    
    @CreationTimestamp
    private LocalDateTime friendsSince;

    public Friendship(Account account1, Account account2) {
        this.account1 = account1;
        this.account2 = account2;
    }

    public Friendship() {}
}
