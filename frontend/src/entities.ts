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

export interface ITestCase {
    fileName: string;
    input: string;
    output: string;
}

export interface ISubmissionResult {
    testCaseId: number;
    statusId: number;
    statusDescription: string;
    executionTime: number;
}

export interface IProblem {
    id: number;
    creator: IAccount;
    title: string;
    slug: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    codeTemplates: {
        cpp: {
            starterCode: string;
            driverCode: string;
        };
        python: {
            starterCode: string;
            driverCode: string;
        };
    };
    testCasesPath: string;
    tags: string[];
}

export interface ISolution {
    code: string;
    programmingLanguage: string;
    problemId: number;
}

export type INotification = {
    id: number;
    receiver: IAccount;
    sender: IAccount;
    type: 'FRIEND_REQUEST' | undefined;
    isRead: boolean;
    timestamp: string;
    payload: JSON | null;
}

export interface IAttachment {
    id: number | null;
    filename: string;
    filedata: string; // Base64 encoded file data
}

export interface IMessage {
    id: number | null;
    sender: IAccount;
    receiver: IAccount;
    text: string;
    attachments: IAttachment[];
    timestamp: string | null;
}

export interface IStreak {
    id: number;
    account1: IAccount;
    account2: IAccount;
    length: number;
    status: 'ACTIVE' | 'BROKEN' | 'PENDING';
    account1CompletedToday: boolean;
    account2CompletedToday: boolean;
}

export interface IStreakInvite {
    id: number;
    sender: IAccount;
    receiver: IAccount;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    timestamp: string;
}