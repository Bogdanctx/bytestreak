package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

import com.bytestreak.backend.dto.ExecutionResultDTO;
import com.bytestreak.backend.dto.SolutionDTO;
import com.bytestreak.backend.dto.TestCaseDTO;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.services.ProblemService;
import com.bytestreak.backend.CodeExecution;
import com.bytestreak.backend.services.ActivityTrackerService;
import com.bytestreak.backend.services.FileStorageService;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.entities.Account;

import org.json.JSONObject;

@RestController
@RequestMapping("/problems")
public class ProblemController {
    @Autowired
    private ProblemRepository repository;

    @Autowired
    private CodeExecution executionService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ActivityTrackerService activityTrackerService;

    @Autowired
    private ProblemService problemService;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/{id}/description")
    public ResponseEntity<Problem> getProblemDescription(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        Problem problem = repository.findById(id).orElse(null);

        if (problem == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(problem);
    }

    @GetMapping("/testcases")
    public ResponseEntity<?> getProblemTestCases(@RequestParam Long problemId) {
        Problem problem = repository.findById(problemId).orElse(null);

        if (problem == null) {
            return ResponseEntity.notFound().build();
        }

        List<TestCaseDTO> testCases = fileStorageService.getTestCases(problem.getTestCasesPath());
        return ResponseEntity.ok(testCases);
    }

    @GetMapping("/problem-of-the-day")
    public ResponseEntity<Problem> getProblemOfTheDay(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        try {
            Problem problemOfTheDay = problemService.getProblemOfTheDay();
            return ResponseEntity.ok(problemOfTheDay);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<List<ExecutionResultDTO>> submitSolution(@RequestBody SolutionDTO solutionDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        if (solutionDTO.getCode() == null || solutionDTO.getProgrammingLanguage() == null || solutionDTO.getProblemId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        Long id = solutionDTO.getProblemId();
        Problem problem = repository.findById(id).orElse(null);

        if (problem == null) {
            return ResponseEntity.notFound().build();
        }

        String slug = problem.getSlug();
        String solutionCode = solutionDTO.getCode();
        String programmingLanguage = solutionDTO.getProgrammingLanguage();

        String codeTemplates = problem.getCodeTemplates();
        JSONObject codeTemplatesJson = new JSONObject(codeTemplates);
        
        try {
            String driverCode = codeTemplatesJson.getJSONObject(programmingLanguage).getString("driver_code");
            String sourceCode = driverCode.replace("{{CODE}}", solutionCode);

            List<ExecutionResultDTO> results = executionService.executeCode(programmingLanguage, sourceCode, slug, problem.getTestCasesPath());

            Account account = accountRepository.findByEmail(authentication.getName());

            activityTrackerService.recordActivity(account);

            for (ExecutionResultDTO result : results) {
                if (result.getStatusId() != 3) {
                    return ResponseEntity.ok(results);
                }
            }

            // if the solution is correct and solved the problem of the day, update the user's streak
            if (problem.isProblemOfTheDay()) {
                LocalDate today = LocalDate.now(ZoneOffset.UTC);

                if (!today.equals(account.getLastDailyQuizDate())) {
                    account.setStreakLength(account.getStreakLength() + 1);
                    account.setLastDailyProblemDate(today);
                    account.setCurrentXP(account.getCurrentXP() + 20);
                    account.setCoins(account.getCoins() + 10);
                    
                    accountRepository.save(account);
                }
            }

            return ResponseEntity.ok(results);

        } catch (Exception e) {
            System.out.println("Error parsing code templates JSON: " + e.getMessage());
        }

        return ResponseEntity.ok(null);
    }

    @GetMapping("/fetch-all")
    public ResponseEntity<?> getAllProblems(@RequestParam(required = false) String difficulty, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        List<Problem> problems = problemService.getAllProblems(difficulty);

        return ResponseEntity.ok(problems);
    }
}
