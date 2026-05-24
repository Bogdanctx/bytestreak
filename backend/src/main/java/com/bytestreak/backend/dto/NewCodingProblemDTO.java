package com.bytestreak.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.bytestreak.backend.enums.Difficulty;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Getter @Setter
public class NewCodingProblemDTO {
    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;
    
    private String codeTemplates;
    private List<TestCaseDTO> testCases;
    private List<String> tags;
    private String validationScript;
}
