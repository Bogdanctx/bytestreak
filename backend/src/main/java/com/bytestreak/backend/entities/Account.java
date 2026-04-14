package com.bytestreak.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter 
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Getter @Setter 
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Getter @Setter 
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Getter @Setter 
    private String password;

    @Getter @Setter 
    private int level = 0;

    @Getter @Setter 
    private int currentXP = 0;

    @Getter @Setter 
    private int problemsSolved = 0;

    @Getter @Setter 
    private int quizzesSolved = 0;

    @Getter @Setter 
    private int streakLength = 0;

    @OneToMany(mappedBy = "creator")
    @Getter @Setter 
    private List<Problem> createdProblems = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "account_solved_problems",
        joinColumns = @JoinColumn(name = "account_id"),
        inverseJoinColumns = @JoinColumn(name = "problem_id")
    )
    @Getter @Setter 
    private List<Problem> solvedProblems = new ArrayList<>();

    // Base64 encoded profile picture
    @Column(length = 5242880) // max 5mb
    @Getter @Setter 
    private String profilePictureUrl = "";

    @ManyToMany
    @JoinTable(
        name = "account_friends",
        joinColumns = @JoinColumn(name = "account_id"),
        inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    @JsonIgnoreProperties("friends")
    @Getter @Setter
    private List<Account> friends = new ArrayList<>();

    protected Account() {}

    public Account(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
