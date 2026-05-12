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

export interface IRoleUpdateNotificationPayload {
    message: string;
}

export interface INotification {
    id: number;
    receiver: IAccount;
    type: NotificationType;
    read: boolean;
    timestamp: string;
    payload: IFriendRequestNotificationPayload | IStreakInviteNotificationPayload;
};

export type NotificationType = 'FRIEND_REQUEST' | 'STREAK_INVITE' | 'ROLE_UPDATE';