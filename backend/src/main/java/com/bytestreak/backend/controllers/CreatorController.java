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

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.ProblemRepository;
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

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ProblemRepository problemRepository;

    // This endpoint is used by the frontend to fetch all problems created by a specific creator. 
    // The creatorId is passed as a query parameter, and the service layer handles the logic to retrieve the corresponding problems from the database.
    // If the user is a moderator or admin, all the problems will be returned, otherwise only the problems created by the user will be returned.
    @GetMapping("/problems")
    public ResponseEntity<?> getProblemsByCreatorId(@RequestParam Long creatorId, Authentication authentication) {
        Account account = accountRepository.findByEmail(authentication.getName());

        if (account.getRole().name().equals("MODERATOR") || account.getRole().name().equals("ADMIN")) {
            List<Problem> problems = problemRepository.findAll();
            return ResponseEntity.ok(problems);
        }
        
        List<Problem> problems = creatorService.getProblemsByCreatorId(creatorId);
        return ResponseEntity.ok(problems);
    }

    @DeleteMapping("/delete-coding-problem/{problemId}")
    public ResponseEntity<?> deleteProblem(@PathVariable Long problemId) {
        Problem problem = creatorService.deleteProblem(problemId);
        return ResponseEntity.ok(problem);
    }

    @PostMapping("/new-problem")
    public ResponseEntity<?> createNewCodingProblem(@RequestBody NewCodingProblemDTO newCodingProblemDTO, Authentication authentication) {
        Account account = accountRepository.findByEmail(authentication.getName());
        Problem newCodingProblem = creatorService.createNewCodingProblem(newCodingProblemDTO, account);

        return ResponseEntity.ok(newCodingProblem);
    }
    

    @PutMapping("/edit-problem/{id}")
    public ResponseEntity<?> editProblem(@PathVariable Long id, @RequestBody EditCodingProblemDTO updatedProblem, Authentication authentication) {
        Account account = accountRepository.findByEmail(authentication.getName());
        Problem editedProblem = creatorService.editCodingProblem(id, updatedProblem, account);
        return ResponseEntity.ok(editedProblem);
    }
}
