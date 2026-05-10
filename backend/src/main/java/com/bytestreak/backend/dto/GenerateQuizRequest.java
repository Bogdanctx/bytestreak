package com.bytestreak.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerateQuizRequest {
    private String programmingLanguage;
    private String customTopic;
}
