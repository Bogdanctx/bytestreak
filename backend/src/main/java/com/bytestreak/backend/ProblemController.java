package com.bytestreak.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.http.ResponseEntity;

import java.util.LinkedHashMap;
import java.util.List;

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

        String codeTemplates = problem.getCodeTemplatesJson();
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
            String testsJSON = newProblemDTO.getTestCasesJson();
            
            String testCasesPath = fileStorageService.saveTestCases(slug, testsJSON);

            Problem problem = new Problem(
                newProblemDTO.getTitle(),
                newProblemDTO.getDescription(),
                newProblemDTO.getDifficulty().toUpperCase(),
                newProblemDTO.getCodeTemplatesJson(),
                newProblemDTO.getTags(),
                testCasesPath,
                slug
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

    @GetMapping("retrieve/all")
    public ResponseEntity<List<Problem>> getAllProblems() {
        List<Problem> problems = repository.findAll();
        return ResponseEntity.ok(problems);
    }

}
