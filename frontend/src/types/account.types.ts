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
    profilePictureUrl: string;
    joinedDate: string;
    role: AccountRole;
}

export type AccountRole = 'USER' | 'CREATOR' | 'MODERATOR' | 'ADMIN';