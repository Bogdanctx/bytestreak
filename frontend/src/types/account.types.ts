import { type IProblem } from "./problem.types";

export interface IAccount {
    id: number;
    username: string;
    email: string;
    level: number;
    currentXP: number;
    problemsSolved: number;
    quizzesSolved: number;
    streakLength: number;
    createdProblems: IProblem[];
    solvedProblems: IProblem[];
    profilePictureUrl: string;
    friends: IAccount[];
}