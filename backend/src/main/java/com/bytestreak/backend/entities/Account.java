package com.bytestreak.backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.bytestreak.backend.enums.Role;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Accounts")
@Getter @Setter
public class Account {
    protected Account() {}

    public Account(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 20, message = "Username must be between 5 and 20 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private int currentXP = 0;
    private int xpAchievedToday = 0;
    private int quizzesSolved = 0;

    private int streakLength = 0;

    private int coins = 0;
    private String bio = "";
    private boolean solvedDailyQuizToday = false;
    private boolean solvedDailyCodingProblemToday = false;

    private String cssEffectStyle; // default effect

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> purchasedEffects = new ArrayList<>();
    
    @Transient
    private Long globalRank;

    // Base64 encoded profile picture
    @Column(length = 5242880) // max 5mb
    private String profilePictureUrl = "";

    @CreationTimestamp
    private String joinedDate;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @ManyToMany
    @JoinTable(
        name = "account_solved_problems",
        joinColumns = @JoinColumn(name = "account_id"),
        inverseJoinColumns = @JoinColumn(name = "problem_id")
    )
    private Set<Problem> solvedProblems = new HashSet<>();
}
