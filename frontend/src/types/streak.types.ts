import { type IAccount } from "./account.types";

export interface IStreak {
    id: number;
    participant1: IAccount;
    participant2: IAccount;
    length: number;

    participant1SolvedToday: boolean;
    participant2SolvedToday: boolean;

    participant1SolvedCorrectly: boolean;
    participant2SolvedCorrectly: boolean;
}

export interface IStreakInvite {
    id: number;
    sender: IAccount;
    receiver: IAccount;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    timestamp: string;
}