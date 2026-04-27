package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.repositories.NotificationRepository;
import com.bytestreak.backend.repositories.FriendInviteRepository;
import com.bytestreak.backend.FriendRequestNotificationPayload;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.FriendInvite;
import com.bytestreak.backend.entities.Notification;
import com.bytestreak.backend.enums.InviteStatus;
import com.bytestreak.backend.enums.NotificationTypes;

import java.util.List;

@Service
public class FriendService {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private FriendInviteRepository friendInviteRepository;

    public FriendInvite sendConnectionRequest(Account sender, Account receiver) {
        FriendInvite invite = new FriendInvite();
        invite.setSender(sender);
        invite.setReceiver(receiver);
        invite.setStatus(InviteStatus.PENDING);

        friendInviteRepository.save(invite);

        FriendRequestNotificationPayload payload = new FriendRequestNotificationPayload();
        payload.setSenderId(sender.getId());
        payload.setUsername(sender.getUsername());
        payload.setProfilePictureUrl(sender.getProfilePictureUrl());
        payload.setMessage("You have a friend request from " + sender.getUsername());
        payload.setInviteId(invite.getId());

        notificationService.sendNotification(receiver, NotificationTypes.FRIEND_REQUEST, payload);

        return invite;
    }

    public void acceptConnectionRequest(Account me, Long inviteId, Long notificationId) {
        FriendInvite invite = friendInviteRepository.findById(inviteId).orElse(null);

        if (invite == null || invite.getStatus() != InviteStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Friend invite not found");
        }

        if (!invite.getReceiver().getId().equals(me.getId())) {
            throw new RuntimeException("Unauthorized: Not your invite");
        }

        Account sender = invite.getSender();

        me.getFriends().add(sender);
        sender.getFriends().add(me);
        
        accountRepository.save(me);
        accountRepository.save(sender);

        // delete the invite
        friendInviteRepository.delete(invite);

        // delete the notification for the receiver
        notificationRepository.deleteById(notificationId);

        // delete the notification
        notificationRepository.deleteById(notificationId);
    }


    public void declineConnectionRequest(Account me, Long inviteId, Long notificationId) {
        FriendInvite invite = friendInviteRepository.findById(inviteId).orElse(null);

        if (invite == null || invite.getStatus() != InviteStatus.PENDING) {
            return;
        }

        if (!invite.getReceiver().getId().equals(me.getId())) {
            throw new RuntimeException("Unauthorized: Not your invite");
        }

        // delete the invite
        friendInviteRepository.delete(invite);

        // delete the notification
        notificationRepository.deleteById(notificationId);
    }

    public void removeFriend(Account me, Long friendId) {
        Account friend = accountRepository
                            .findById(friendId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        me.getFriends().removeIf(a -> a.getId().equals(friendId));
        friend.getFriends().removeIf(a -> a.getId().equals(me.getId()));

        accountRepository.save(me);
        accountRepository.save(friend);
    }

    public List<FriendInvite> getPendingConnections(Account me) {
        return friendInviteRepository.findByReceiverAndStatus(me, InviteStatus.PENDING);
    }

    public List<FriendInvite> getSentConnections(Account me) {
        return friendInviteRepository.findBySenderAndStatus(me, InviteStatus.PENDING);
    }
}
