package com.bytestreak.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestCaseDTO {
    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "Input is required")
    private String input;

    @NotBlank(message = "Output is required")
    private String output;
}
