package com.bytestreak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class NewProblemDTO {
    private String title;
    private String description;
    private String difficulty;
    private String codeTemplates;
    private String testCases;
    private List<String> tags;
}
