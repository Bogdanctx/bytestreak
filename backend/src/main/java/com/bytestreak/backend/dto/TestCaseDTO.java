package com.bytestreak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class TestCaseDTO {
    private String fileName;
    private String input;
    private String output;
}
