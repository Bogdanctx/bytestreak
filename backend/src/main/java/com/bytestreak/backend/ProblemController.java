package com.bytestreak.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/problems")
public class ProblemController {
    private final ProblemRepository repository;

    public ProblemController(ProblemRepository repository) {
        this.repository = repository;
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
    public ResponseEntity<String> submitSolution(@RequestBody SolutionDTO solutionDTO) {
        if (solutionDTO.getCode() == null || solutionDTO.getProgrammingLanguage() == null || solutionDTO.getProblemId() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        System.out.println("Received solution for problem ID: " + solutionDTO.getProblemId());
        System.out.println("Programming Language: " + solutionDTO.getProgrammingLanguage());
        System.out.println("Code:\n" + solutionDTO.getCode());


        return ResponseEntity.ok("Submission successful");
    }

    @PostMapping("/new")
    public ResponseEntity<String> createProblem(@RequestBody NewProblemDTO newProblemDTO) {
        try {
            Problem problem = new Problem(
                newProblemDTO.getTitle(),
                newProblemDTO.getDescription(),
                newProblemDTO.getDifficulty().toUpperCase(),
                newProblemDTO.getCodeTemplatesJson(),
                newProblemDTO.getTags(),
                newProblemDTO.getTestCasesJson()
            );

            repository.save(problem);

            return ResponseEntity.ok("Problem created successfully with ID: " + problem.getId());

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
