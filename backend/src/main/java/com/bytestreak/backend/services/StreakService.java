package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private SimpMessagingTemplate messagingTemplate;
    
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
        
        messagingTemplate.convertAndSendToUser(friend.getEmail(),"/queue/streak-invites", payload);
        
        return invite;
    }

    public void removeStreakBetweenUsers(Account me, Account friend) {
        StreakInvite invite = streakInviteRepository.findBySenderAndReceiver(me, friend);
        
        if (invite == null) {
            return;
        }

        streakInviteRepository.delete(invite);

        Streak streak = streakRepository.findStreakBetweenUsers(me, friend);
        
        if (streak == null) {
            return;
        }

        streakRepository.delete(streak);
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
}
