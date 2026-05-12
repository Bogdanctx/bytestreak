package com.bytestreak.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Streak {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "participant1_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account participant1;

    @ManyToOne
    @JoinColumn(name = "participant2_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Account participant2;

    private boolean participant1SolvedToday = false;
    private boolean participant2SolvedToday = false;

    private boolean participant1SolvedCorrectly = false;
    private boolean participant2SolvedCorrectly = false;

    private int length = 0;
    private int oldLength = 0;
}