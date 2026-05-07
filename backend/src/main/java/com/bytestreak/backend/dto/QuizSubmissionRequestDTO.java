package com.bytestreak.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizSubmissionRequestDTO {
    @NotNull
    private Long quizId;

    @NotBlank
    private String selectedAnswer;
}