package com.bytestreak.backend;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestCaseDTO {
    private String fileName;
    private String input;
    private String expectedOutput;
}
