export interface IAccount {
    id: number;
    username: string;
    email: string;
    currentXP: number;
    codingProblemsSolved: number;
    quizzesSolved: number;
    streakLength: number;
    coins: number;
    bio: string;
    lastDailyQuizDate: string;
    lastDailyProblemDate: string;
    profilePictureUrl: string;
    joinedDate: string;
    role: AccountRole;
    globalRank?: number;
}

export type AccountRole = 'USER' | 'CREATOR' | 'MODERATOR' | 'ADMIN';