package com.bytestreak.backend;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NewProblemDTO {
    private String title;
    private String description;
    private String difficulty;
    private String codeTemplates;
    private String testCases;
    private List<String> tags;
    private Account creator;
}
