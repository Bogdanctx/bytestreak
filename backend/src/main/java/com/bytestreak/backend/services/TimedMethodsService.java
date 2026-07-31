package com.bytestreak.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.SeasonEndNotificationPayload;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.entities.Quiz;
import com.bytestreak.backend.entities.Streak;
import com.bytestreak.backend.enums.NotificationTypes;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.ProblemRepository;
import com.bytestreak.backend.repositories.QuizRepository;
import com.bytestreak.backend.repositories.StreakRepository;

import jakarta.transaction.Transactional;

@Service
public class TimedMethodsService {
    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private StreakRepository streakRepository;


    private void resetDailyQuiz() {
        Quiz currentDailyQuiz = quizRepository.findTopByOrderByQueuePriority();
        if (currentDailyQuiz != null) {
            // quizRepository.delete(currentDailyQuiz);
        }

        List<Streak> activeStreaks = streakRepository.findAll();
        for(Streak streak: activeStreaks) {
            if (!streak.isParticipant1SolvedToday() || !streak.isParticipant2SolvedToday()) {
                streak.setLength(0);
                streak.setOldLength(0);
            }

            streak.setParticipant1SolvedToday(false);
            streak.setParticipant2SolvedToday(false);
            streak.setParticipant1SolvedCorrectly(false);
            streak.setParticipant2SolvedCorrectly(false);
        }
        streakRepository.saveAll(activeStreaks);

        List<Account> accounts = accountRepository.findAll();
        for (Account account : accounts) {
            account.setSolvedDailyQuizToday(false);
        }
        accountRepository.saveAll(accounts);
    }

    private void resetDailyCodingProblem() {
        Problem dailyProblem = problemRepository.findByIsDailyChallangeTrue();
        
        if (dailyProblem != null) {
            dailyProblem.setDailyChallange(false);
            problemRepository.save(dailyProblem);
        }

        List<Problem> allProblems = problemRepository.findAll();
        Problem newDailyProblem = allProblems.get((int) (Math.random() * allProblems.size()));
        newDailyProblem.setDailyChallange(true);
        problemRepository.save(newDailyProblem);

        List<Account> accounts = accountRepository.findAll();
        for (Account account : accounts) {
            account.setSolvedDailyCodingProblemToday(false);
            account.setXpAchievedToday(0);
        }
        accountRepository.saveAll(accounts);
    }

    @Scheduled(cron = "0 0 0 * * ?") // every day at midnight
    public void generateDailyChallenges() {
        resetDailyQuiz();
        resetDailyCodingProblem();
    }


    // This method can be called at the end of each season to reset any season-specific data
    // automatically called at the end of each month
    @Scheduled(cron = "0 0 0 1 * ?") // every month on the 1st at midnight
    public void resetSeason() {
        List<Account> allAccounts = accountRepository.findAll();
        
        for(Account account : allAccounts) {
            long globalRank = accountRepository.calculateGlobalRank(account.getCurrentXP(), account.getId()) + 1;

            SeasonEndNotificationPayload payload = new SeasonEndNotificationPayload();

            if (globalRank == 1) {
                account.setCoins(account.getCoins() + 500);
                payload.setMessage("Congratulations! You finished the season as the top player with a global rank of 1! You won 500 coins!");
            }
            else if (globalRank == 2 || globalRank == 3) {
                account.setCoins(account.getCoins() + 250);
                payload.setMessage("Great job! You finished the season as one of the top players with a global rank of " + globalRank + "! You won 250 coins!");
            }
            else if (4 <= globalRank && globalRank <= 10) {
                account.setCoins(account.getCoins() + 100);
                payload.setMessage("Well done! You finished the season with a global rank of " + globalRank + "! You won 100 coins!");
            }
            else {
                payload.setMessage("The season has ended! Your global rank was: " + globalRank + ".");
            }
            
            account.setCurrentXP(0);
            notificationService.sendNotification(account, NotificationTypes.SEASON_END, payload);
        }

        accountRepository.saveAll(allAccounts);

        System.out.println("Season reset completed. All accounts have been updated and notifications sent.");
    }
}
