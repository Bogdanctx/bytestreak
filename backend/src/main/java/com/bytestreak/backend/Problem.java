package com.bytestreak.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.util.List;

@Entity
@Table(name = "problems")
@Getter
@Setter
public class Problem {
    enum Difficulty {
        EASY, MEDIUM, HARD
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private List<String> tags;

    protected Problem() {}

    public Problem(String title, String description, Difficulty difficulty, List<String> tags) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.tags = tags;
    }
}
