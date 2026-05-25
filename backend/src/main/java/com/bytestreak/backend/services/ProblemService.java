package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.repositories.ProblemVoteRepository;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.ProblemVote;
import com.bytestreak.backend.enums.Difficulty;
import com.bytestreak.backend.enums.Visibility;

import java.util.List;


@Service
public class ProblemService {
    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private ProblemVoteRepository problemVoteRepository;
    
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

    public Problem submitFeedback(Long problemId, String feedback, Account account) {
        Problem problem = problemRepository.findById(problemId).orElse(null);
        if (problem == null) {
            throw new IllegalArgumentException("Problem not found");
        }

        ProblemVote problemVote = problemVoteRepository.findByProblemAndAccount(problem, account);
        boolean isLikeRequest = feedback.equalsIgnoreCase("like");
        boolean isDislikeRequest = feedback.equalsIgnoreCase("dislike");

        if (!isLikeRequest && !isDislikeRequest) {
            throw new IllegalArgumentException("Invalid feedback value: " + feedback);
        }

        if (problemVote == null) {
            problemVote = new ProblemVote();
            problemVote.setProblem(problem);
            problemVote.setAccount(account);
            problemVote.setLike(isDislikeRequest);
            
            problemVoteRepository.save(problemVote);
        } 
        else {
            if (problemVote.isLike() && isLikeRequest) {
                problemVoteRepository.delete(problemVote);
            } 
            else if (!problemVote.isLike() && isDislikeRequest) {
                problemVoteRepository.delete(problemVote);
            } 
            else {
                problemVote.setLike(isLikeRequest);
                problemVoteRepository.save(problemVote);
            }
        }

        return problem;
    }

}