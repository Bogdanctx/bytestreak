package com.bytestreak.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.bytestreak.backend.enums.ProblemDifficulty;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Getter @Setter
public class NewCodingProblemDTO {
    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private ProblemDifficulty problemDifficulty;
    
    private String codeTemplates;
    private String testCases;
    private List<String> tags;
}
