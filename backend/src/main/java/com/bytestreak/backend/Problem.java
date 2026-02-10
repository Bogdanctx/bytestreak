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
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "problems")
@Getter
@Setter
public class Problem {
    enum Difficulty {
        EASY, MEDIUM, HARD
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT")
    private String starterCode;

    @Column(columnDefinition = "TEXT")
    private String tags; 

    protected Problem() {}

    public Problem(String title, String description, String difficulty, String starterCode, String tags) {
        this.title = title;
        this.description = description;
        this.difficulty = Difficulty.valueOf(difficulty);
        this.starterCode = starterCode;
        this.tags = tags;
    }
}
