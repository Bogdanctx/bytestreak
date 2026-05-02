package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import com.bytestreak.backend.services.CreatorService;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.dto.EditCodingProblemDTO;
import com.bytestreak.backend.dto.NewCodingProblemDTO;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/creator")
public class CreatorController {
    @Autowired
    private CreatorService creatorService;

    @GetMapping("/fetch-by-creator")
    public List<Problem> getProblemsByCreatorId(@RequestParam Long creatorId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        try {
            List<Problem> problems = creatorService.getProblemsByCreatorId(creatorId);
            return problems;
        }
        catch (Exception e) {
            throw new RuntimeException("Error fetching problems for creator with ID: " + creatorId, e);
        }
    }

    @DeleteMapping("/delete-problem")
    public ResponseEntity<?> deleteProblem(@RequestParam Long problemId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        try {
            Problem problem = creatorService.deleteProblem(problemId);
            return ResponseEntity.ok(problem);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/new-problem")
    public ResponseEntity<?> createNewCodingProblem(@RequestBody NewCodingProblemDTO newCodingProblemDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {
            Problem newCodingProblem = creatorService.createNewCodingProblem(newCodingProblemDTO, authentication);
            return ResponseEntity.ok(newCodingProblem);
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating problem");
        }
    }
    

    @PutMapping("/edit-problem/{id}")
    public ResponseEntity<?> editProblem(
        @PathVariable Long id, 
        @RequestBody EditCodingProblemDTO updatedProblem,
        Authentication authentication) 
    {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        try {
            Problem editedProblem = creatorService.editCodingProblem(id, updatedProblem, authentication);
            return ResponseEntity.ok(editedProblem);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
