package com.bytestreak.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bytestreak.backend.repositories.SubmissionRepository;

@RestController
@RequestMapping("/submissions")
public class SubmissionController {
    @Autowired
    private SubmissionRepository submissionRepository;

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<?> getSubmissionsForProblem(@PathVariable Long problemId) {
        return ResponseEntity.ok(submissionRepository.findByProblemId(problemId));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getSubmissionsForAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(submissionRepository.findByAccountId(accountId));
    }

    @GetMapping("/account/{accountId}/problem/{problemId}")
    public ResponseEntity<?> getSubmissionsForAccountAndProblem(@PathVariable Long accountId, @PathVariable Long problemId) {
        return ResponseEntity.ok(submissionRepository.findByAccountIdAndProblemId(accountId, problemId));
    }
}
