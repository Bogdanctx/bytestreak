import type { IAccount } from "./account.types";
import type { IStreak } from "./streak.types";

export interface IUserProfile {
    account: IAccount;
    streaks: IStreak[];
    activityGraph: number[];
}
