package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.entities.Quiz;
import com.bytestreak.backend.repositories.QuizRepository;

@Service
public class DailyChallangesService {
    @Autowired
    private QuizRepository quizRepository;

    @Scheduled(cron = "0 0 0 * * ?", zone = "UTC") // every day at midnight
    public void generateDailyChallenges() {
        Quiz currentDailyQuiz = quizRepository.findTopByOrderByQueuePriority();

        if (currentDailyQuiz != null) {
            quizRepository.delete(currentDailyQuiz);
        }
    }
}
