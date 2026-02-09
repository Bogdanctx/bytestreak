package com.bytestreak.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/problems")
public class ProblemController {
    private final ProblemRepository repository;

    public ProblemController(ProblemRepository repository) {
        this.repository = repository;
    }


    @GetMapping("/{id}/description")
    public ResponseEntity<String> getProblemDescription(@PathVariable Long id) {
        Problem problem = repository.findById(id).orElse(null);

        if (problem == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(problem.getDescription());
    }

    
}
