package com.bytestreak.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.entities.Problem;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.entities.Account;

@RestController
@RequestMapping("/creator")
public class CreatorController {
    @Autowired
    private ProblemRepository repository;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping("/fetch-by-creator")
    public List<Problem> getProblemsByCreatorId(@RequestParam(required = false) Long creatorId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        if (creatorId == null) {
            Account me = accountRepository.findByEmail(authentication.getName());

            return repository.findByCreatorId(me.getId());
        }

        return repository.findByCreatorId(creatorId);
    }

    @DeleteMapping("/delete-problem")
    public void deleteProblem(@RequestParam Long problemId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        repository.deleteById(problemId);
    }
}
