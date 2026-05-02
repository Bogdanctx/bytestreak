package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;

import com.bytestreak.backend.entities.Quiz;
import com.bytestreak.backend.repositories.QuizRepository;
import com.bytestreak.backend.services.QuizService;
import java.util.List;

@RestController
@RequestMapping("/quizzes")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizRepository quizRepository;
    
    @GetMapping("/generate-quiz")
    public ResponseEntity<?> generateQuiz(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        try {
            Quiz quiz = quizService.generateQuiz();
            return ResponseEntity.ok(quiz);
        } 
        catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating quiz: " + e.getMessage());
        }
    }
    
    @GetMapping("/drafts")
    public ResponseEntity<?> getDrafts(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        List<Quiz> drafts = quizRepository.findAll();
        return ResponseEntity.ok(drafts);
    }
    
}
