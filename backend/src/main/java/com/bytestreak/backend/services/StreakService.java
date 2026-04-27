package com.bytestreak.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

import com.bytestreak.backend.StreakInviteNotificationPayload;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Streak;
import com.bytestreak.backend.entities.StreakInvite;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.StreakInviteRepository;
import com.bytestreak.backend.repositories.StreakRepository;
import com.bytestreak.backend.enums.InviteStatus;
import com.bytestreak.backend.enums.NotificationTypes;

import java.util.List;

@Service
public class StreakService {
    @Autowired 
    private StreakRepository streakRepository;
    
    @Autowired 
    private AccountRepository accountRepository;
    
    @Autowired 
    private StreakInviteRepository streakInviteRepository;
    
    @Autowired 
    private NotificationService notificationService;

    public List<Streak> getActiveStreaks(Authentication authentication) {
        String email = authentication.getName();
        Account account = accountRepository.findByEmail(email);

        return streakRepository.findByAccount1OrAccount2(account, account);
    }

    public List<StreakInvite> getPendingInvites(Account account) {
        return streakInviteRepository.findBySenderAndStatus(account, InviteStatus.PENDING);
    }

    public void inviteToStreak(Account friendAccount, Authentication authentication) {
        String email = authentication.getName();
        Account sender = accountRepository.findByEmail(email);

        if (streakInviteRepository.existsBySenderAndReceiverAndStatus(sender, friendAccount, InviteStatus.PENDING)) {
            return;
        }

        StreakInvite invite = new StreakInvite();
        invite.setSender(sender);
        invite.setReceiver(friendAccount);
        invite.setStatus(InviteStatus.PENDING);
        streakInviteRepository.save(invite);

        StreakInviteNotificationPayload payload = new StreakInviteNotificationPayload();
        payload.setSender(sender);
        payload.setMessage("You have a streak invitation from " + sender.getUsername());

        notificationService.sendNotification(friendAccount, NotificationTypes.STREAK_INVITE, payload);
    }
}
