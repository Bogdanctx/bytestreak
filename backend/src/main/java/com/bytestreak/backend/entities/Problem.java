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
import com.bytestreak.backend.enums.ProblemDifficulty;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "Problems")
@Getter @Setter
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private ProblemDifficulty problemDifficulty;

    @Column(columnDefinition = "TEXT")
    private String codeTemplates;

    private String testCasesPath;

    @Convert(converter = TagStringListConverter.class)
    private List<String> tags = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Account creator;
}
