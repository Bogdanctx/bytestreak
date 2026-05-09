export interface IAccount {
    id: number;
    username: string;
    email: string;
    currentXP: number;
    problemsSolved: number;
    quizzesSolved: number;
    streakLength: number;
    coins: number;
    lastDailyQuizDate: string;
    profilePictureUrl: string;
    friends: IAccount[];
}