package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.repositories.ProblemVoteRepository;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.ProblemVote;
import com.bytestreak.backend.enums.Difficulty;
import com.bytestreak.backend.enums.Visibility;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class ProblemService {
    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private ProblemVoteRepository problemVoteRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    public List<Problem> getPublicProblems(String difficulty, String query, Long cursor, boolean excludeSolved, Authentication authentication) {
        final int LIMIT = 20;
        
        // If query is provided, search by title
        if (query != null && !query.isBlank()) {
            List<Problem> results;
            
            if (difficulty == null || difficulty.isBlank()) {
                results = problemRepository.findPublicProblemsByTitleWithCursor(Visibility.PUBLIC, query, cursor);
            } else {
                try {
                    Difficulty difficultyEnum = Difficulty.valueOf(difficulty.toUpperCase());
                    results = problemRepository.findPublicProblemsByTitleAndDifficultyWithCursor(Visibility.PUBLIC, difficultyEnum, query, cursor);
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid difficulty level: " + difficulty);
                }
            }
            
            // Filter out solved problems if requested
            if (excludeSolved && authentication != null) {
                Account account = accountRepository.findByEmail(authentication.getName());
                if (account != null) {
                    Set<Problem> solvedProblems = account.getSolvedProblems();
                    results = results.stream().filter(p -> !solvedProblems.contains(p)).collect(Collectors.toList());
                }
            }
            
            // Return only LIMIT + 1 results (the extra one indicates if there are more results)
            return results.stream().limit(LIMIT + 1).collect(Collectors.toList());
        }
        
        // Original behavior for difficulty filter without search
        if (difficulty == null || difficulty.isBlank()) {
            List<Problem> problems = problemRepository.findByVisibility(Visibility.PUBLIC);
            
            if (excludeSolved && authentication != null) {
                Account account = accountRepository.findByEmail(authentication.getName());
                if (account != null) {
                    Set<Problem> solvedProblems = account.getSolvedProblems();
                    problems = problems.stream().filter(p -> !solvedProblems.contains(p)).collect(Collectors.toList());
                }
            }
            
            return problems;
        }

        try {
            Difficulty difficultyEnum = Difficulty.valueOf(difficulty.toUpperCase());
            List<Problem> problems = problemRepository.findByVisibilityAndDifficulty(Visibility.PUBLIC, difficultyEnum);
            
            if (excludeSolved && authentication != null) {
                Account account = accountRepository.findByEmail(authentication.getName());
                if (account != null) {
                    Set<Problem> solvedProblems = account.getSolvedProblems();
                    problems = problems.stream().filter(p -> !solvedProblems.contains(p)).collect(Collectors.toList());
                }
            }
            
            return problems;
        } 
        catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid difficulty level: " + difficulty);
        }
    }

    public Problem getProblemOfTheDay() {
        Problem problemOfTheDay = problemRepository.findByIsDailyChallangeTrue();
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

        if (!feedback.equalsIgnoreCase("like") && !feedback.equalsIgnoreCase("dislike")) {
            throw new IllegalArgumentException("Invalid feedback type: " + feedback);
        }

        ProblemVote problemVote = problemVoteRepository.findByProblemAndAccount(problem, account);
        boolean like = feedback.equalsIgnoreCase("like");

        if (problemVote == null) {
            problemVote = new ProblemVote();
            problemVote.setProblem(problem);
            problemVote.setAccount(account);
            problemVote.setLike(like);
            
            problemVoteRepository.save(problemVote);
        }
        else {
            if (problemVote.isLike() == like) { 
                problemVoteRepository.delete(problemVote); 
            }
            else { 
                problemVote.setLike(like);
                problemVoteRepository.save(problemVote);
            }
        }

        return problemRepository.findById(problemId).orElse(null); 
    }

}
