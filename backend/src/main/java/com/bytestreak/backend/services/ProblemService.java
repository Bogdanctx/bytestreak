package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.enums.Difficulty;

import java.util.List;


@Service
public class ProblemService {
    @Autowired
    private ProblemRepository problemRepository;
    
    public List<Problem> getAllProblems(String difficulty) {
        if (difficulty == null || difficulty.isBlank()) {
            return problemRepository.findAll();
        }

        try {
            Difficulty difficultyEnum = Difficulty.valueOf(difficulty.toUpperCase());
            
            return problemRepository.findByDifficulty(difficultyEnum);     
        } 
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid difficulty level: " + difficulty);
        }
    }
}
