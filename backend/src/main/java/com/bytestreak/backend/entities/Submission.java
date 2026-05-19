package com.bytestreak.backend.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String starterCode;

    @ManyToOne // Many submissions can be associated with one problem
    @JoinColumn(name = "problem_id") // Foreign key column in the Submission table
    private Problem problem;

    @ManyToOne // Many submissions can be associated with one account
    @JoinColumn(name = "account_id") // Foreign key column in the Submission table
    private Account account;

    private Float percentageCorrect;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
