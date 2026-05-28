package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

import com.bytestreak.backend.dto.ExecutionResultDTO;
import com.bytestreak.backend.dto.SolutionDTO;
import com.bytestreak.backend.dto.TestCaseDTO;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.repositories.ProblemVoteRepository;
import com.bytestreak.backend.repositories.SubmissionRepository;
import com.bytestreak.backend.services.ProblemService;
import com.bytestreak.backend.CodeExecution;
import com.bytestreak.backend.services.ActivityTrackerService;
import com.bytestreak.backend.services.FileStorageService;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.entities.ProblemVote;
import com.bytestreak.backend.entities.Submission;
import com.bytestreak.backend.enums.Visibility;
import com.bytestreak.backend.entities.Account;

import org.json.JSONObject;

@RestController
@RequestMapping("/problems")
public class ProblemController {
    @Autowired
    private ProblemRepository problemRepository;

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

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ProblemVoteRepository problemVoteRepository;


    @GetMapping("/public")
    public ResponseEntity<?> getPublicProblems(@RequestParam(required = false) String difficulty) {
        List<Problem> problems = problemService.getPublicProblems(difficulty);

        return ResponseEntity.ok(problems);
    }

    @PutMapping("/{id}/toggle-problem-visibility")
    public ResponseEntity<Problem> toggleProblemVisibility(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id).orElse(null);

        if (problem == null) {
            return ResponseEntity.notFound().build();
        }

        if (problem.getVisibility() == Visibility.PUBLIC) {
            problem.setVisibility(Visibility.HIDDEN);
        } 
        else {
            problem.setVisibility(Visibility.PUBLIC);
        }

        problemRepository.save(problem);

        return ResponseEntity.ok(problem);
    }


    @GetMapping("/{id}/description")
    public ResponseEntity<Problem> getProblemDescription(@PathVariable Long id, Authentication authentication) {
        Problem problem = problemRepository.findById(id).orElse(null);

        if (problem == null) {
            return ResponseEntity.notFound().build();
        }

        Account account = accountRepository.findByEmail(authentication.getName());

        ProblemVote vote = problemVoteRepository.findByProblemAndAccount(problem, account);

        if (vote != null) {
            problem.setUserVote(vote.isLike() ? "like" : "dislike");
        }

        return ResponseEntity.ok(problem);
    }

    @GetMapping("/testcases")
    public ResponseEntity<?> getProblemTestCases(@RequestParam Long problemId) {
        Problem problem = problemRepository.findById(problemId).orElse(null);

        if (problem == null) {
            return ResponseEntity.notFound().build();
        }

        List<TestCaseDTO> testCases = fileStorageService.getTestCases(problem.getTestCasesPath());
        return ResponseEntity.ok(testCases);
    }

    @GetMapping("/problem-of-the-day")
    public ResponseEntity<Problem> getProblemOfTheDay() {
        try {
            Problem problemOfTheDay = problemService.getProblemOfTheDay();
            return ResponseEntity.ok(problemOfTheDay);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<Problem> submitFeedback(@PathVariable Long id, @RequestBody Map<String, String> feedbackMap, Authentication authentication) {
        Account account = accountRepository.findByEmail(authentication.getName());

        String feedback = feedbackMap.get("feedback");
        try {
            Problem updatedProblem = problemService.submitFeedback(id, feedback, account);
            return ResponseEntity.ok(updatedProblem);
        }
        catch (IllegalArgumentException e) {
            System.out.println("Error submitting feedback: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<List<ExecutionResultDTO>> submitSolution(@RequestBody SolutionDTO solutionDTO, Authentication authentication) {
        if (solutionDTO.getCode() == null || solutionDTO.getProgrammingLanguage() == null || solutionDTO.getProblemId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        Long id = solutionDTO.getProblemId();
        Problem problem = problemRepository.findById(id).orElse(null);

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

            List<ExecutionResultDTO> results = executionService.executeCode(programmingLanguage, 
                                                                            sourceCode, 
                                                                            slug, 
                                                                            problem.getTestCasesPath(),
                                                                            problem.getValidationScriptPath()
                                                                        );

            Account account = accountRepository.findByEmail(authentication.getName());

            activityTrackerService.recordActivity(account);

            Submission submission = new Submission();
            submission.setAccount(account);
            submission.setProblem(problem);
            submission.setStarterCode(solutionCode);
            submission.setPercentageCorrect((float) results.stream().filter(r -> r.getStatusId() == 3).count() / results.size() * 100);
            submissionRepository.save(submission);


            for (ExecutionResultDTO result : results) {
                if (result.getStatusId() != 3) {
                    return ResponseEntity.ok(results);
                }
            }

            // if the solution is correct and solved the problem of the day, update the user's streak
            if (problem.isProblemOfTheDay()) {
                LocalDate today = LocalDate.now(ZoneOffset.UTC);

                if (account.getLastDailyProblemDate() == null || !today.equals(account.getLastDailyProblemDate())) {
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
}
