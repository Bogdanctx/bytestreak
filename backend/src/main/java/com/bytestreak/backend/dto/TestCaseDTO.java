package com.bytestreak.backend;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestCaseDTO {
    private String fileName;
    private String input;
    private String output;

    public TestCaseDTO() {}

    public TestCaseDTO(String fileName, String input, String output) {
        this.fileName = fileName;
        this.input = input;
        this.output = output;
    }
}
