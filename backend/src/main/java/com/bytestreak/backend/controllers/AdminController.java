package com.bytestreak.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bytestreak.backend.services.TimedMethodsService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private TimedMethodsService timedMethodsService;
    
    @GetMapping("/reset-daily-quiz")
    public String resetDailyQuiz() {
        timedMethodsService.resetDailyQuiz();
        return "Daily quiz reset successfully.";
    }

    @GetMapping("/reset-daily-coding-problem")
    public String resetDailyCodingProblem() {
        timedMethodsService.resetDailyCodingProblem();
        return "Daily coding problem reset successfully.";
    }

    @GetMapping("/reset-dailies")
    public String resetDailies() {
        timedMethodsService.generateDailyChallenges();
        return "Dailies reset successfully.";
    }

    @GetMapping("/reset-season")
    public String resetSeason() {
        timedMethodsService.resetSeason();
        return "Season reset successfully.";
    }
}
