package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.DailyActivity;
import com.bytestreak.backend.repositories.DailyActivityRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ActivityTrackerService {

    @Autowired
    private DailyActivityRepository dailyActivityRepository;

    public void recordActivity(Account account) {
        LocalDate today = LocalDate.now();
        
        DailyActivity activity = dailyActivityRepository
            .findByAccountIdAndActivityDate(account.getId(), today)
            .orElse(new DailyActivity(account, today, 0));

        activity.setActivityCount(activity.getActivityCount() + 1);
        dailyActivityRepository.save(activity);
    }

    public List<Integer> getYearlyActivityGraph(Long accountId) {
        LocalDate today = LocalDate.now();
        LocalDate oneYearAgo = today.minusDays(364);

        List<DailyActivity> dbActivities = dailyActivityRepository.findRecentActivity(accountId, oneYearAgo);

        Map<LocalDate, Integer> activityMap = dbActivities.stream()
            .collect(Collectors.toMap(DailyActivity::getActivityDate, DailyActivity::getActivityCount));

        List<Integer> fullYearGraph = new ArrayList<>();
        
        for (int i = 0; i < 365; i++) {
            LocalDate targetDate = oneYearAgo.plusDays(i);
            fullYearGraph.add(activityMap.getOrDefault(targetDate, 0));
        }

        return fullYearGraph;
    }
}