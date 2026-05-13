package com.bytestreak.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bytestreak.backend.entities.Report;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Message;
import com.bytestreak.backend.entities.Post;
import com.bytestreak.backend.entities.PostComment;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.MessageRepository;
import com.bytestreak.backend.repositories.PostCommentRepository;
import com.bytestreak.backend.repositories.ReportRepository;
import com.bytestreak.backend.repositories.PostRepository;
import com.bytestreak.backend.repositories.ProblemRepository;

@RestController
@RequestMapping("/reports")
public class ReportController {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private PostCommentRepository postCommentRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @PostMapping("/submit/account/{id}")
    private ResponseEntity<?> reportAccount(@PathVariable Long id,  Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account reporter = accountRepository.findByUsername(authentication.getName());
        Account reportedAccount = accountRepository.findById(id).orElse(null);
        if (reportedAccount == null) {
            return ResponseEntity.status(404).body("Reported account not found");
        }
        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedAccount(reportedAccount);
        reportRepository.save(report);
        return ResponseEntity.ok("Account reported successfully");
    }

    @GetMapping("/all")
    private ResponseEntity<?> getAllReports(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @PostMapping("/submit/post/{id}")
    private ResponseEntity<?> reportPost(@PathVariable Long id,  Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account reporter = accountRepository.findByUsername(authentication.getName());
        Post reportedPost = postRepository.findById(id).orElse(null);
        if (reportedPost == null) {
            return ResponseEntity.status(404).body("Reported post not found");
        }
        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedPost(reportedPost);
        reportRepository.save(report);
        return ResponseEntity.ok("Post reported successfully");
    }

    @PostMapping("/submit/message/{id}")
    private ResponseEntity<?> reportMessage(@PathVariable Long id,  Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account reporter = accountRepository.findByUsername(authentication.getName());
        Message reportedMessage = messageRepository.findById(id).orElse(null);
        if (reportedMessage == null) {
            return ResponseEntity.status(404).body("Reported message not found");
        }
        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedMessage(reportedMessage);
        reportRepository.save(report);
        return ResponseEntity.ok("Message reported successfully");
    }

    @PostMapping("/submit/comment/{id}")
    private ResponseEntity<?> reportComment(@PathVariable Long id,  Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account reporter = accountRepository.findByUsername(authentication.getName());
        PostComment reportedComment = postCommentRepository.findById(id).orElse(null);
        if (reportedComment == null) {
            return ResponseEntity.status(404).body("Reported comment not found");
        }
        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedComment(reportedComment);
        reportRepository.save(report);
        return ResponseEntity.ok("Comment reported successfully");
    }

    @PostMapping("/submit/coding-problem/{id}")
    private ResponseEntity<?> reportCodingProblem(@PathVariable Long id,  Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account reporter = accountRepository.findByUsername(authentication.getName());
        Problem reportedCodingProblem = problemRepository.findById(id).orElse(null);
        if (reportedCodingProblem == null) {
            return ResponseEntity.status(404).body("Reported coding problem not found");
        }

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedCodingProblem(reportedCodingProblem);
        reportRepository.save(report);

        return ResponseEntity.ok("Coding problem reported successfully");
    }

    @DeleteMapping("/delete/{id}")
    private ResponseEntity<?> deleteReport(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Report report = reportRepository.findById(id).orElse(null);
        if (report == null) {
            return ResponseEntity.status(404).body("Report not found");
        }

        reportRepository.delete(report);
        return ResponseEntity.ok("Report deleted successfully");
    }
}
