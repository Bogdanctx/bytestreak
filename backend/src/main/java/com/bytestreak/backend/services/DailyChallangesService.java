package com.bytestreak.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.entities.Quiz;
import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.repositories.QuizRepository;

@Service
public class DailyChallangesService {
    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ProblemRepository problemRepository;

    //@Scheduled(cron = "0 0 0 * * ?", zone = "UTC") // every day at midnight
    @Scheduled(fixedRate = 10000) // for testing purposes, runs every 24 hours
    public void generateDailyChallenges() {
        // Quiz currentDailyQuiz = quizRepository.findTopByOrderByQueuePriority();

        // if (currentDailyQuiz != null) {
        //     quizRepository.delete(currentDailyQuiz);
        // }

        Problem dailyProblem = problemRepository.findByIsProblemOfTheDayTrue();
        
        if (dailyProblem != null) {
            dailyProblem.setProblemOfTheDay(false);
            problemRepository.save(dailyProblem);
        }

        List<Problem> allProblems = problemRepository.findAll();
        Problem newDailyProblem = allProblems.get((int) (Math.random() * allProblems.size()));
        newDailyProblem.setProblemOfTheDay(true);
        problemRepository.save(newDailyProblem);
    }
}
