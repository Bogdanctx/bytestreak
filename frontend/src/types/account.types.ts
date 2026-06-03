import type { IProblem } from "./problem.types";

export interface IAccount {
    id: number;
    username: string;
    email: string;
    currentXP: number;
    xpAchievedToday: number;
    quizzesSolved: number;
    streakLength: number;
    coins: number;
    bio: string;
    solvedDailyQuizToday: boolean;
    solvedDailyCodingProblemToday: boolean;
    profilePictureUrl: string;
    joinedDate: string;
    role: AccountRole;
    globalRank?: number;
    cssEffectStyle: string;
    purchasedEffects: string[];
    solvedProblems: IProblem[];
}

export type AccountRole = 'USER' | 'CREATOR' | 'MODERATOR' | 'ADMIN';