import { type IAccount } from "./account.types";

export interface IFriendInvite {
    id: number;
    sender: IAccount;
    receiver: IAccount;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    timestamp: string;
}

export interface IStreakInvite {
    id: number;
    sender: IAccount;
    receiver: IAccount;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    timestamp: string;
}

