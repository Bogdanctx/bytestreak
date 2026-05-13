package com.bytestreak.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import lombok.Getter;
import lombok.Setter;

import com.bytestreak.backend.TagStringListConverter;
import com.bytestreak.backend.enums.Difficulty;
import com.bytestreak.backend.enums.Visibility;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "Problems")
@Getter @Setter
public class Problem {
    protected Problem() {}

    public Problem(String title, String description, Difficulty difficulty, String codeTemplates, String testCasesPath, List<String> tags, Account creator) {
        this.title = title;
        this.slug = title.toLowerCase().replace(" ", "-");
        this.description = description;
        this.difficulty = difficulty;
        this.codeTemplates = codeTemplates;
        this.testCasesPath = testCasesPath;
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

    private String testCasesPath;

    private int likes = 0;
    private int dislikes = 0;

    @Enumerated(EnumType.STRING)
    private Visibility visibility = Visibility.HIDDEN;

    @Convert(converter = TagStringListConverter.class)
    private List<String> tags = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Account creator;
}
