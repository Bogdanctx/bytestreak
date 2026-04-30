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

import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.services.FileStorageService;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.enums.Difficulty;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.dto.EditCodingProblemDTO;
import com.bytestreak.backend.dto.NewCodingProblemDTO;
import com.bytestreak.backend.entities.Account;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/creator")
public class CreatorController {
    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/fetch-by-creator")
    public List<Problem> getProblemsByCreatorId(@RequestParam(required = false) Long creatorId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        if (creatorId == null) {
            Account me = accountRepository.findByEmail(authentication.getName());

            return problemRepository.findByCreatorId(me.getId());
        }

        return problemRepository.findByCreatorId(creatorId);
    }

    @DeleteMapping("/delete-problem")
    public ResponseEntity<?> deleteProblem(@RequestParam Long problemId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        problemRepository.deleteById(problemId);
        return ResponseEntity.ok("Problem deleted successfully");
    }

    @PostMapping("/new-problem")
    public ResponseEntity<?> createNewCodingProblem(@RequestBody NewCodingProblemDTO newCodingProblemDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        Account creator = accountRepository.findByEmail(authentication.getName());

        String slug = newCodingProblemDTO.getTitle().toLowerCase().replace(" ", "-");
        String testsJSON = newCodingProblemDTO.getTestCases();
        String testCasesPath = null;

        try {
            testCasesPath = fileStorageService.saveTestCases(slug, testsJSON);
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving test cases");
        }

        Problem problem = new Problem();
        problem.setTitle(newCodingProblemDTO.getTitle());
        problem.setSlug(slug);
        problem.setDescription(newCodingProblemDTO.getDescription());

        Difficulty difficultyEnum = Difficulty.valueOf(newCodingProblemDTO.getDifficulty().toString().toUpperCase());
        problem.setDifficulty(difficultyEnum);
        
        problem.setCodeTemplates(newCodingProblemDTO.getCodeTemplates());
        problem.setTestCasesPath(testCasesPath);
        problem.setTags(newCodingProblemDTO.getTags());
        problem.setCreator(creator);
        
        problemRepository.save(problem);

        return ResponseEntity.ok("Problem created successfully");
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

        Problem existingProblem = problemRepository.findById(id).orElse(null);
        if (existingProblem == null) {
            return ResponseEntity.notFound().build();
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        if (!existingProblem.getCreator().getId().equals(me.getId())) {
            return ResponseEntity.status(403).body("You are not the creator of this problem");
        }

        String slug = updatedProblem.getTitle().toLowerCase().replace(" ", "-");
        String testsJSON = updatedProblem.getTestCases();
        String testCasesPath = null;

        try {
            testCasesPath = fileStorageService.saveTestCases(slug, testsJSON);
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving test cases");
        }


        Difficulty difficultyEnum = Difficulty.valueOf(updatedProblem.getDifficulty().toString().toUpperCase());

        existingProblem.setTitle(updatedProblem.getTitle());
        existingProblem.setSlug(slug);
        existingProblem.setDescription(updatedProblem.getDescription());
        existingProblem.setDifficulty(difficultyEnum);
        existingProblem.setCodeTemplates(updatedProblem.getCodeTemplates());
        existingProblem.setTestCasesPath(testCasesPath);
        existingProblem.setTags(updatedProblem.getTags());

        problemRepository.save(existingProblem);
        return ResponseEntity.ok("Problem updated successfully");
    }
}
