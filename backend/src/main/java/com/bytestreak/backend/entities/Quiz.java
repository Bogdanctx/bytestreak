package com.bytestreak.backend.entities;

import jakarta.persistence.Column;
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
    public Quiz(String codeSnippet, String programmingLanguage, List<String> distractors, String correctAnswer, int queuePriority) {
        this.codeSnippet = codeSnippet;
        this.programmingLanguage = programmingLanguage;
        this.distractors = distractors;
        this.correctAnswer = correctAnswer;
        this.queuePriority = queuePriority;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(columnDefinition = "TEXT", length = 65535)
    private String codeSnippet;
    
    private String programmingLanguage;
    private List<String> distractors;
    private String correctAnswer;
    private int queuePriority;
}
