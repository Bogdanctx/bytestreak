package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.enums.Difficulty;
import com.bytestreak.backend.enums.Visibility;

import java.util.List;


@Service
public class ProblemService {
    @Autowired
    private ProblemRepository problemRepository;
    
    public List<Problem> getPublicProblems(String difficulty) {
        if (difficulty == null || difficulty.isBlank()) {
            return problemRepository.findByVisibility(Visibility.PUBLIC);
        }

        try {
            Difficulty difficultyEnum = Difficulty.valueOf(difficulty.toUpperCase());
            
            return problemRepository.findByVisibilityAndDifficulty(Visibility.PUBLIC, difficultyEnum);
        } 
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid difficulty level: " + difficulty);
        }
    }

    public Problem getProblemOfTheDay() {
        Problem problemOfTheDay = problemRepository.findByIsProblemOfTheDayTrue();
        if (problemOfTheDay == null) {
            throw new RuntimeException("No problem of the day found");
        }

        return problemOfTheDay;
    }
}
