package com.bytestreak.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.GenerationType;

@Entity
@Getter @Setter
@Table(name = "problem_votes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"account_id", "problem_id"})
})
public class ProblemVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @Column(name = "is_like")
    private boolean isLike; // "like" or "dislike"
}
