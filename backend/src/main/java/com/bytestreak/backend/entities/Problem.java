package com.bytestreak.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.Setter;

import com.bytestreak.backend.TagStringListConverter;
import com.bytestreak.backend.enums.Difficulty;
import com.bytestreak.backend.enums.Visibility;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

import org.hibernate.annotations.Formula;

import java.util.ArrayList;

@Entity
@Table(name = "Problems")
@Getter @Setter
public class Problem {
    protected Problem() {}

    public Problem(String title, String description, Difficulty difficulty, String codeTemplates, String testCasesPath, String validationScriptPath, List<String> tags, Account creator) {
        this.title = title;
        this.slug = title.toLowerCase().replace(" ", "-");
        this.description = description;
        this.difficulty = difficulty;
        this.codeTemplates = codeTemplates;
        this.testCasesPath = testCasesPath;
        this.validationScriptPath = validationScriptPath;
        this.tags = tags;
        this.creator = creator;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(columnDefinition = "TEXT")
    private String codeTemplates;

    private String testCasesPath = null;
    private String validationScriptPath = null;
    @Transient
    private String validationScriptContent = null;

    @Formula("(SELECT COUNT(*) FROM problem_votes pv WHERE pv.problem_id = id AND pv.is_like = true)")
    private int likes;

    @Formula("(SELECT COUNT(*) FROM problem_votes pv WHERE pv.problem_id = id AND pv.is_like = false)")
    private int dislikes;

    @Transient
    @JsonProperty("userVote")
    private String userVote = null; // "like", "dislike", or null

    private boolean isDailyChallange = false;

    @Enumerated(EnumType.STRING)
    private Visibility visibility = Visibility.HIDDEN;

    @Convert(converter = TagStringListConverter.class)
    private List<String> tags = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "creator_id")
    @JsonIgnoreProperties("solvedProblems") // to prevent infinite recursion during JSON serialization
    private Account creator;
}
