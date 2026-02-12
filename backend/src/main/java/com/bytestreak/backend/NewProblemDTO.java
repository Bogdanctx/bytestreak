package com.bytestreak.backend;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewProblemDTO {
    private String title;
    private String description;
    private String difficulty;
    private String codeTemplatesJson;
    private String tags;
}
