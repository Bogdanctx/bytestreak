export interface Account {
    accountId: number;
    username: string;
    email: string;
    level: number;
    currentXP: number;
    problemsSolved: number;
    quizzesSolved: number;
    streakLength: number;
    friendsCount: number;
    createdProblems: Problem[];
    solvedProblems: Problem[];
    profilePictureUrl: string;
}

export interface Problem {
    id: number;
    creator: Account;
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
