package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.bytestreak.backend.dto.GenerateQuizRequest;
import com.bytestreak.backend.dto.DailyQuizResponseDTO;
import com.bytestreak.backend.dto.QuizSubmissionRequestDTO;
import com.bytestreak.backend.entities.Quiz;
import com.bytestreak.backend.repositories.QuizRepository;
import com.bytestreak.backend.services.QuizService;
import java.util.List;
import java.util.Collections;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/quizzes")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizRepository quizRepository;

    
    @PostMapping("/generate-quiz")
    public ResponseEntity<?> generateQuiz(@RequestBody GenerateQuizRequest request) {
        try {
            Quiz quiz = quizService.generateQuiz(request.getProgrammingLanguage(), request.getCustomTopic());
            return ResponseEntity.ok(quiz);
        } 
        catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating quiz: " + e.getMessage());
        }
    }

    @PostMapping("/generate-bulk")
    public ResponseEntity<?> generateBulkQuizzes(@RequestParam(required = false) Integer numberOfQuizzes) {
        System.out.println("Received request to generate " + numberOfQuizzes + " quizzes");
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
    
    
    @GetMapping("/queue")
    public ResponseEntity<?> getDrafts() {
        List<Quiz> drafts = quizRepository.findAllByOrderByQueuePriorityAsc();
        return ResponseEntity.ok(drafts);
    }

    @PutMapping("/save")
    public ResponseEntity<?> saveQuizzes(@RequestBody List<Quiz> quizzes) {
        try {
            for(int i = 0; i < quizzes.size(); i++) {
                quizzes.get(i).setQueuePriority(i + 1);
            }

            quizRepository.saveAll(quizzes);

            return ResponseEntity.ok("Quizzes saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving quizzes: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteQuiz(@RequestParam Long id) {
        try {
            quizRepository.deleteById(id);
            return ResponseEntity.ok("Quiz deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting quiz: " + e.getMessage());
        }
    }

    @GetMapping("/daily")
    public ResponseEntity<?> getDailyQuiz() {
        try {
            Quiz dailyQuiz = quizRepository.findTopByOrderByQueuePriority();

            DailyQuizResponseDTO response = new DailyQuizResponseDTO();
            response.id = dailyQuiz.getId();
            response.codeSnippet = dailyQuiz.getCodeSnippet();
            
            response.answerOptions = dailyQuiz.getDistractors();
            response.answerOptions.add(dailyQuiz.getCorrectAnswer());

            // Shuffle the answer options
            Collections.shuffle(response.answerOptions);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching daily quiz: " + e.getMessage());
        }
    }

    @PostMapping("/daily/submit-answer")
    public ResponseEntity<?> submitDailyQuizAnswer(@RequestBody QuizSubmissionRequestDTO request, Authentication authentication) {
        try {
            boolean isCorrect = quizService.solveDailyQuiz(request.getQuizId(), request.getSelectedAnswer(), authentication.getName());

            return ResponseEntity.ok(isCorrect);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error submitting answer: " + e.getMessage());
        }
    }
    
    
}
