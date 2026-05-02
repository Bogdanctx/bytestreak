package com.bytestreak.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.bytestreak.backend.enums.Difficulty;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Getter @Setter
public class EditCodingProblemDTO {
    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;
    
    private String codeTemplates;
    private String testCases;
    private List<String> tags;
}
