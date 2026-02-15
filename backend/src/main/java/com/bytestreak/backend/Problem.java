package com.bytestreak.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "problems")
@Getter
@Setter
public class Problem {
    public enum Difficulty {
        EASY, MEDIUM, HARD
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;


    @Column(columnDefinition = "TEXT")
    private String codeTemplates;

    private String testCasesPath;

    @Convert(converter = TagStringListConverter.class)
    private List<String> tags = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "creator_id")
    @JsonIgnore
    private Account creator;

    protected Problem() {}

    public Problem(String title,
                    String slug,
                    String description, 
                    Difficulty difficulty, 
                    String codeTemplates, 
                    String testCasesPath, 
                    List<String> tags, 
                    Account creator) 
    {
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.difficulty = difficulty;
        this.codeTemplates = codeTemplates;
        this.testCasesPath = testCasesPath;
        this.tags = tags;
        this.creator = creator;
    }
}
