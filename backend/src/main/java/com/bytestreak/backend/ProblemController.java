package com.bytestreak.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.http.ResponseEntity;

import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/problems")
public class ProblemController {
    private final ProblemRepository repository;
    private final CodeExecution executionService;
    private final FileStorageService fileStorageService;

    public ProblemController(ProblemRepository repository, 
                            CodeExecution executionService,
                            FileStorageService fileStorageService) 
    {
        this.repository = repository;
        this.executionService = executionService;
        this.fileStorageService = fileStorageService;
    }


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
    public ResponseEntity<?> submitSolution(@RequestBody SolutionDTO solutionDTO) {
        if (solutionDTO.getCode() == null || solutionDTO.getProgrammingLanguage() == null || solutionDTO.getProblemId() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
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

        return ResponseEntity.ok("Solution submitted successfully");
    }

    @PostMapping("/new")
    public ResponseEntity<String> createProblem(@RequestBody NewProblemDTO newProblemDTO) {
        try {
            String slug = newProblemDTO.getTitle().toLowerCase().replace(" ", "-");
            String testsJSON = newProblemDTO.getTestCases();
            
            String testCasesPath = fileStorageService.saveTestCases(slug, testsJSON);

            Problem problem = new Problem(
                newProblemDTO.getTitle(),
                slug,
                newProblemDTO.getDescription(),
                Problem.Difficulty.valueOf(newProblemDTO.getDifficulty().toUpperCase()),
                newProblemDTO.getCodeTemplates(),
                testCasesPath,
                newProblemDTO.getTags(),
                newProblemDTO.getCreator()
            );

            repository.save(problem);

            return ResponseEntity.ok("Problem created successfully");   
        } 
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid Difficulty level");
        } 
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating problem");
        }
    }

    @PutMapping("edit/{id}")
    public ResponseEntity<String> updateProblem(@PathVariable Long id, @RequestBody NewProblemDTO problemDTO) {
        try {
            Problem existingProblem = repository.findById(id).orElse(null);
            
            if (existingProblem == null) {
                return ResponseEntity.notFound().build();
            }

            String slug = problemDTO.getTitle().toLowerCase().replace(" ", "-");
            String testsJSON = problemDTO.getTestCases();
            String testCasesPath = fileStorageService.saveTestCases(slug, testsJSON);

            existingProblem.setTitle(problemDTO.getTitle());
            existingProblem.setSlug(slug);
            existingProblem.setDescription(problemDTO.getDescription());
            existingProblem.setDifficulty(Problem.Difficulty.valueOf(problemDTO.getDifficulty().toUpperCase()));
            existingProblem.setCodeTemplates(problemDTO.getCodeTemplates());
            existingProblem.setTestCasesPath(testCasesPath);
            existingProblem.setTags(problemDTO.getTags());
            
            repository.save(existingProblem);
            
            return ResponseEntity.ok("Problem updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating problem");
        }
    }

    @GetMapping("retrieve/all")
    public ResponseEntity<List<Problem>> getAllProblems() {
        List<Problem> problems = repository.findAll();
        return ResponseEntity.ok(problems);
    }
}
