package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;

import com.bytestreak.backend.dto.ExecutionResultDTO;
import com.bytestreak.backend.dto.NewCodingProblemDTO;
import com.bytestreak.backend.dto.SolutionDTO;
import com.bytestreak.backend.dto.TestCaseDTO;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.services.ProblemService;
import com.bytestreak.backend.CodeExecution;
import com.bytestreak.backend.services.FileStorageService;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.enums.ProblemDifficulty;
import com.bytestreak.backend.entities.Account;

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
    private AccountRepository accountRepository;

    @Autowired
    private ProblemService problemService;

    @GetMapping("/{id}/description")
    public ResponseEntity<Problem> getProblemDescription(@PathVariable Long id) {
        Problem problem = repository.findById(id).orElse(null);

        if (problem == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(problem);
    }

    @GetMapping("/testcases")
    public ResponseEntity<List<TestCaseDTO>> getProblemTestCases(@RequestParam Long problemId) {
        Problem problem = repository.findById(problemId).orElse(null);

        if (problem == null) {
            return ResponseEntity.notFound().build();
        }

        List<TestCaseDTO> testCases = fileStorageService.getTestCases(problem.getTestCasesPath());
        return ResponseEntity.ok(testCases);
    }

    @PostMapping("/submit")
    public ResponseEntity<List<ExecutionResultDTO>> submitSolution(@RequestBody SolutionDTO solutionDTO) {
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
        JSONParser parser = new JSONParser(codeTemplates);
        
        try {
            Object parsedTemplates = parser.parse();
            LinkedHashMap<String, Object> templatesMap = (LinkedHashMap<String, Object>) parsedTemplates;
            LinkedHashMap<String, String> templateForLanguage = (LinkedHashMap<String, String>) templatesMap.get(programmingLanguage);
            
            String driverCodeRaw = templateForLanguage.get("driverCode");
            String driverCode = driverCodeRaw.replace("\\n", "\n");
            String sourceCode = driverCode.replace("{{CODE}}", solutionCode);
            
            List<ExecutionResultDTO> results = executionService.executeCode(programmingLanguage, sourceCode, slug, problem.getTestCasesPath());
            
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
