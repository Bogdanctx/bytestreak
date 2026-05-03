package com.bytestreak.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Quiz {
    protected Quiz() {}
    public Quiz(String codeSnippet, String programmingLanguage, List<String> distractors, String correctAnswer) {
        this.codeSnippet = codeSnippet;
        this.programmingLanguage = programmingLanguage;
        this.distractors = distractors;
        this.correctAnswer = correctAnswer;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String codeSnippet;
    private String programmingLanguage;
    private List<String> distractors;
    private String correctAnswer;
    private int queueIndex;
}
