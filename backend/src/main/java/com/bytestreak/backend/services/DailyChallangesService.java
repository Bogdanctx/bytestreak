package com.bytestreak.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.SeasonEndNotificationPayload;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.entities.Quiz;
import com.bytestreak.backend.enums.NotificationTypes;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.repositories.QuizRepository;

import jakarta.transaction.Transactional;

@Service
public class DailyChallangesService {
    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private NotificationService notificationService;

    @Scheduled(cron = "0 0 0 * * ?", zone = "UTC") // every day at midnight
    public void generateDailyChallenges() {
        Quiz currentDailyQuiz = quizRepository.findTopByOrderByQueuePriority();

        if (currentDailyQuiz != null) {
            quizRepository.delete(currentDailyQuiz);
        }

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

    // This method can be called at the end of each season to reset any season-specific data
    // automatically called at the end of each month
    @Transactional // Ensures all or nothing saves
    @Scheduled(cron = "0 0 0 1 * ?", zone = "UTC") // every month on the 1st at midnight
    public void resetSeason() {
        List<Account> allAccounts = accountRepository.findAll();
        
        for(Account account : allAccounts) {
            long globalRank = accountRepository.calculateGlobalRank(account.getCurrentXP(), account.getId()) + 1;
            int bonusXP = 0;

            SeasonEndNotificationPayload payload = new SeasonEndNotificationPayload();

            if (globalRank == 1) {
                bonusXP = (int)(0.15 * account.getCurrentXP()); // 15% bonus for the top player
                account.setCoins(account.getCoins() + 200);
                payload.setMessage("Congratulations! You finished the season as the top player with a global rank of 1! You receive a 15% bonus on your current XP: " + bonusXP + " XP and 200 coins!");            
            }
            else if (globalRank == 2) {
                bonusXP = (int)(0.1 * account.getCurrentXP()); // 10% bonus for the second player
                account.setCoins(account.getCoins() + 100);
                payload.setMessage("Great job! You finished the season as the second player with a global rank of 2! You receive a 10% bonus on your current XP: " + bonusXP + " XP and 100 coins!");
            }
            else if (globalRank == 3) {
                bonusXP = (int)(0.05 * account.getCurrentXP()); // 5% bonus for the third player
                account.setCoins(account.getCoins() + 50);
                payload.setMessage("Well done! You finished the season as the third player with a global rank of 3! You receive a 5% bonus on your current XP: " + bonusXP + " XP and 50 coins!");
            }
            else {
                payload.setMessage("The season has ended! Your global rank was: " + account.getGlobalRank() + ".");
            }
            
            account.setCurrentXP(bonusXP);
            notificationService.sendNotification(account, NotificationTypes.SEASON_END, payload);
        }

        accountRepository.saveAll(allAccounts);

        System.out.println("Season reset completed. All accounts have been updated and notifications sent.");
    }
}
