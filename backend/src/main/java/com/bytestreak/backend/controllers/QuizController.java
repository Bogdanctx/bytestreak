package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.bytestreak.backend.entities.Quiz;
import com.bytestreak.backend.repositories.QuizRepository;
import com.bytestreak.backend.services.QuizService;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/quizzes")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizRepository quizRepository;
    
    @PostMapping("/generate-quiz")
    public ResponseEntity<?> generateQuiz(@RequestParam String programmingLanguage, @RequestParam(required = false) String customTopic, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        try {
            Quiz quiz = quizService.generateQuiz(programmingLanguage, customTopic);
            return ResponseEntity.ok(quiz);
        } 
        catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating quiz: " + e.getMessage());
        }
    }

    @PostMapping("/generate-bulk")
    public ResponseEntity<?> generateBulkQuizzes(@RequestParam(required = false) Integer numberOfQuizzes, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        try {
            if (numberOfQuizzes == null || numberOfQuizzes <= 0) {
                numberOfQuizzes = 5;
            }

            List<Quiz> quizzes = quizService.generateBulkQuizzes(numberOfQuizzes);
            return ResponseEntity.ok(quizzes);
        } 
        catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating quizzes: " + e.getMessage());
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

    @PutMapping("/save-quiz")
    public ResponseEntity<?> saveQuiz(@RequestBody Quiz quiz, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {
            quizRepository.save(quiz);
            return ResponseEntity.ok("Quiz saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving quiz: " + e.getMessage());
        }
    }
}
