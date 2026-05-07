export interface IAccount {
    id: number;
    username: string;
    email: string;
    currentXP: number;
    problemsSolved: number;
    quizzesSolved: number;
    streakLength: number;
    coins: number;
    solvedDailyQuizToday: boolean;
    profilePictureUrl: string;
    friends: IAccount[];
}