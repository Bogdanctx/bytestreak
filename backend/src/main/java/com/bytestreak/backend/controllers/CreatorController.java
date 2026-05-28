package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import com.bytestreak.backend.services.CreatorService;

import jakarta.mail.Quota.Resource;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.exceptions.ResourceAlreadyExistsException;
import com.bytestreak.backend.exceptions.ResourceNotFoundException;
import com.bytestreak.backend.repositories.AccountRepository;
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

    @GetMapping("/problems?creatorId={creatorId}")
    public ResponseEntity<?> getProblemsByCreatorId(@RequestParam Long creatorId) {
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
