package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.StreakInviteNotificationPayload;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.StreakInvite;
import com.bytestreak.backend.entities.Streak;
import com.bytestreak.backend.enums.InviteStatus;
import com.bytestreak.backend.enums.NotificationTypes;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.NotificationRepository;
import com.bytestreak.backend.repositories.StreakInviteRepository;
import com.bytestreak.backend.repositories.StreakRepository;

import jakarta.validation.ValidationException;

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

    @Autowired
    private AccountRepository accountRepository;

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
        payload.setCssEffectStyle(me.getCssEffectStyle());

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
                streak.setParticipant1SolvedCorrectly(isCorrect);
            } 
            else {
                streak.setParticipant2SolvedToday(true);
                streak.setParticipant2SolvedCorrectly(isCorrect);
            }

            if (!isCorrect) {
                if (streak.getLength() > 0) {
                    streak.setOldLength(streak.getLength());
                }
                streak.setLength(0);
            } 
            else {
                if (streak.isParticipant1SolvedToday() && streak.isParticipant2SolvedToday()) {
                    if (streak.isParticipant1SolvedCorrectly() && streak.isParticipant2SolvedCorrectly()) {
                        streak.setLength(streak.getLength() + 1);

                        if (streak.getLength() == 7) {
                            streak.getParticipant1().setCoins(streak.getParticipant1().getCoins() + 20);
                            streak.getParticipant2().setCoins(streak.getParticipant2().getCoins() + 20);
                        }
                        else if (streak.getLength() == 14) {
                            streak.getParticipant1().setCoins(streak.getParticipant1().getCoins() + 50);
                            streak.getParticipant2().setCoins(streak.getParticipant2().getCoins() + 50);
                        }
                        else if(streak.getLength() == 30) {
                            streak.getParticipant1().setCoins(streak.getParticipant1().getCoins() + 150);
                            streak.getParticipant2().setCoins(streak.getParticipant2().getCoins() + 150);
                        }
                        else if (streak.getLength() == 100) {
                            streak.getParticipant1().setCoins(streak.getParticipant1().getCoins() + 500);
                            streak.getParticipant2().setCoins(streak.getParticipant2().getCoins() + 500);
                        }
                        else if(streak.getLength() > 100) {

                            // For every 30 days after 100, give 550 coins to each participant
                            int length = streak.getLength();
                            while (length >= 100) {
                                length -= 100;
                            }

                            if (length % 30 == 0) {
                                streak.getParticipant1().setCoins(streak.getParticipant1().getCoins() + 550);
                                streak.getParticipant2().setCoins(streak.getParticipant2().getCoins() + 550);
                            }
                            
                        }
                    }
                }
            }
        }

        streakRepository.saveAll(activeStreaks);
    }

    public void saveAllStreaksOfUser(Account solver) {
        List<Streak> activeStreaks = streakRepository.findActiveStreaksForUser(solver.getId());
        
        if (solver.getCoins() < 200) {
            throw new ValidationException("Not enough coins.");
        }

        boolean savedAny = false;

        for (Streak streak : activeStreaks) {
            if (streak.getOldLength() > 0 && streak.getLength() == 0) {
                streak.setLength(streak.getOldLength());
                
                if (streak.getParticipant1().getId().equals(solver.getId())) {
                    streak.setParticipant1SolvedCorrectly(true);
                    streak.setParticipant1SolvedToday(true);
                } 
                else {
                    streak.setParticipant2SolvedCorrectly(true);
                    streak.setParticipant2SolvedToday(true);
                }
                savedAny = true;
            }
        }

        if (!savedAny) {
            throw new ValidationException("Nothing to restore.");
        }

        solver.setCoins(solver.getCoins() - 200);
        streakRepository.saveAll(activeStreaks);
        accountRepository.save(solver);
    }

}
