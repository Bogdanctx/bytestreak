package com.bytestreak.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public ResponseEntity<?> reportAccount(@PathVariable Long id,  Authentication authentication) {
        Account reporter = accountRepository.findByEmail(authentication.getName());
        Account reportedAccount = accountRepository.findById(id).orElse(null);
        if (reportedAccount == null) {
            return ResponseEntity.notFound().build();
        }
        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedAccount(reportedAccount);
        reportRepository.save(report);
        return ResponseEntity.ok("Account reported successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllReports() {        
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @PostMapping("/submit/post/{id}")
    public ResponseEntity<?> reportPost(@PathVariable Long id,  Authentication authentication) {
        Account reporter = accountRepository.findByEmail(authentication.getName());
        Post reportedPost = postRepository.findById(id).orElse(null);
        if (reportedPost == null) {
            return ResponseEntity.notFound().build();
        }
        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedPost(reportedPost);
        reportRepository.save(report);
        return ResponseEntity.ok("Post reported successfully");
    }

    @PostMapping("/submit/message/{id}")
    public ResponseEntity<?> reportMessage(@PathVariable Long id,  Authentication authentication) {
        Account reporter = accountRepository.findByEmail(authentication.getName());
        Message reportedMessage = messageRepository.findById(id).orElse(null);
        if (reportedMessage == null) {
            return ResponseEntity.notFound().build();
        }
        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedMessage(reportedMessage);
        reportRepository.save(report);
        return ResponseEntity.ok("Message reported successfully");
    }

    @PostMapping("/submit/comment/{id}")
    public ResponseEntity<?> reportComment(@PathVariable Long id,  Authentication authentication) {
        Account reporter = accountRepository.findByEmail(authentication.getName());
        PostComment reportedComment = postCommentRepository.findById(id).orElse(null);
        if (reportedComment == null) {
            return ResponseEntity.notFound().build();
        }
        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedComment(reportedComment);
        reportRepository.save(report);
        return ResponseEntity.ok("Comment reported successfully");
    }

    @PostMapping("/submit/coding-problem/{id}")
    public ResponseEntity<?> reportCodingProblem(@PathVariable Long id,  Authentication authentication) {
        Account reporter = accountRepository.findByEmail(authentication.getName());
        Problem reportedCodingProblem = problemRepository.findById(id).orElse(null);
        if (reportedCodingProblem == null) {
            return ResponseEntity.notFound().build();
        }

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedCodingProblem(reportedCodingProblem);
        reportRepository.save(report);

        return ResponseEntity.ok("Coding problem reported successfully");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        Report report = reportRepository.findById(id).orElse(null);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }

        reportRepository.delete(report);
        return ResponseEntity.ok("Report deleted successfully");
    }
}
