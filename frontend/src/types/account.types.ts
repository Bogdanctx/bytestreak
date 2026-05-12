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
    role: 'USER' | 'CREATOR' | 'ADMIN';
}