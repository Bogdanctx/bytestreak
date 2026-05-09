package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.StreakInviteNotificationPayload;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.StreakInvite;
import com.bytestreak.backend.entities.Streak;
import com.bytestreak.backend.enums.InviteStatus;
import com.bytestreak.backend.enums.NotificationTypes;
import com.bytestreak.backend.repositories.NotificationRepository;
import com.bytestreak.backend.repositories.StreakInviteRepository;
import com.bytestreak.backend.repositories.StreakRepository;

import java.util.List;

@Service
public class StreakService {
    @Autowired
    private StreakInviteRepository streakInviteRepository;

    @Autowired
    private StreakRepository streakRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    public StreakInvite inviteFriendToStreak(Account me, Account friend) {
        StreakInvite invite = new StreakInvite();
        invite.setSender(me);
        invite.setReceiver(friend);
        invite.setStatus(InviteStatus.PENDING);
        streakInviteRepository.save(invite);

        StreakInviteNotificationPayload payload = new StreakInviteNotificationPayload();
        payload.setMessage(me.getUsername() + " has invited you to a streak!");
        payload.setSenderId(me.getId());
        payload.setProfilePictureUrl(me.getProfilePictureUrl());
        payload.setUsername(me.getUsername());
        payload.setInviteId(invite.getId());

        notificationService.sendNotification(friend, NotificationTypes.STREAK_INVITE, payload);
                
        return invite;
    }

    public Streak removeStreakBetweenUsers(Account me, Account friend) {
        StreakInvite invite = streakInviteRepository.findByAccount1AndAccount2(me, friend);
        if (invite != null) {
            streakInviteRepository.delete(invite);
        }

        Streak streak = streakRepository.findStreakBetweenUsers(me, friend);
        if (streak != null) {
            streakRepository.delete(streak);
        }

        return streak;
    }

    public void acceptStreakInvite(Account me, Long inviteId, Long notificationId) {
        StreakInvite invite = streakInviteRepository.findById(inviteId).orElseThrow(() -> new IllegalArgumentException("Invite not found"));
        
        if (!invite.getReceiver().getId().equals(me.getId())) {
            throw new IllegalArgumentException("You are not the receiver of this invite");
        }

        invite.setStatus(InviteStatus.ACCEPTED);
        streakInviteRepository.save(invite);

        Streak streak = new Streak();
        streak.setParticipant1(me);
        streak.setParticipant2(invite.getSender());
        streak.setLength(0);

        streakRepository.save(streak);

        notificationRepository.deleteById(notificationId);
    }

    public void declineStreakInvite(Account me, Long inviteId, Long notificationId) {
        StreakInvite invite = streakInviteRepository.findById(inviteId).orElseThrow(() -> new IllegalArgumentException("Invite not found"));
        
        if (!invite.getReceiver().getId().equals(me.getId())) {
            throw new IllegalArgumentException("You are not the receiver of this invite");
        }

        invite.setStatus(InviteStatus.DECLINED);
        streakInviteRepository.save(invite);

        notificationRepository.deleteById(notificationId);
        streakInviteRepository.delete(invite);
    }

    public void handleSolvedDailyQuiz(Account solver, boolean isCorrect) {
        List<Streak> activeStreaks = streakRepository.findActiveStreaksForUser(solver.getId());
    
        for (Streak streak: activeStreaks) {
            boolean isParticipant1 = streak.getParticipant1().getId().equals(solver.getId());
        
            if (isParticipant1) {
                streak.setParticipant1SolvedToday(true);
            }
            else {
                streak.setParticipant2SolvedToday(true);
            }

            streak.setOldLength(streak.getLength());

            if (isCorrect) {
                // increase the streak length if both participants have solved their daily quiz today
                if (streak.isParticipant1SolvedToday() && streak.isParticipant2SolvedToday()) {
                    streak.setLength(streak.getLength() + 1);
                }
            }
            else {
                // reset the streak length if either participant got their daily quiz wrong
                streak.setLength(0);
            }
        }

        streakRepository.saveAll(activeStreaks);
    }

    public void saveStreakOfUser(Account solver) {
        List<Streak> activeStreaks = streakRepository.findActiveStreaksForUser(solver.getId());
        if (activeStreaks.isEmpty()) {
            return;
        }

        if (solver.getCoins() < 15) {
            throw new IllegalArgumentException("Not enough coins to save the streak");
        }

        for (Streak streak: activeStreaks) {
            streak.setLength(streak.getOldLength());
            streakRepository.save(streak);
        }
    }

}
