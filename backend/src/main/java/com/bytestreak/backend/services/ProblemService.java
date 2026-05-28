package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.repositories.ProblemVoteRepository;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.ProblemVote;
import com.bytestreak.backend.enums.Difficulty;

import java.util.List;


@Service
public class ProblemService {
    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private ProblemVoteRepository problemVoteRepository;
    
    public List<Problem> getPublicProblems(String difficulty, String query, Long cursor, boolean excludeSolved, Authentication authentication) {
        Difficulty diff = null;
        if (difficulty != null) {
            try {
                diff = Difficulty.valueOf(difficulty.toUpperCase());
            } 
            catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid difficulty level: " + difficulty);
            }
        }

        String accountEmail = authentication.getName();
        
        int pageNumber = cursor != null ? cursor.intValue() : 0;
        PageRequest pageRequest = PageRequest.of(pageNumber, 20);

        if (query != null && !query.isEmpty()) {
            query = "%" + query.toLowerCase() + "%";
        }

        return problemRepository.findPublicProblems(diff, query, excludeSolved, accountEmail, pageRequest).getContent();
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
