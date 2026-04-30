import { type IAccount } from "./account.types";

export interface IFriendRequestNotificationPayload {
    message: string;

    senderId: number;
    profilePictureUrl: string;
    username: string;

    inviteId: number;
}

export interface IStreakInviteNotificationPayload {
    message: string;

    senderId: number;
    profilePictureUrl: string;
    username: string;

    inviteId: number;
}

export interface INotification {
    id: number;
    receiver: IAccount;
    type: 'FRIEND_REQUEST' | 'STREAK_INVITE';
    read: boolean;
    timestamp: string;
    payload: IFriendRequestNotificationPayload | IStreakInviteNotificationPayload;
};

