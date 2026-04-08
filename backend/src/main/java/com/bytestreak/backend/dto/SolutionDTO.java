package com.bytestreak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class SolutionDTO {
    private String code;
    private String programmingLanguage;
    private Long problemId;
}
