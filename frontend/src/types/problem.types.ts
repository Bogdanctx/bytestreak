import { type IAccount } from "./account.types";

export interface IProblem {
    id: number;
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
    creator: IAccount;
    visibility: "PUBLIC" | "HIDDEN";
    likes: number;
    dislikes: number;
    userVote: "like" | "dislike" | null;
}

export interface IProblemCreateDTO {
    title: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    codeTemplates: string;
    testCases: ITestCase[];
    tags: string[];
    validationScript?: string;
}

export interface IProblemTestCaseDTO {
    fileName: string;
    input: string;
    output: string;
}

export interface ISubmissionResult {
    testCaseId: number;
    statusId: number;
    statusDescription: string;
}

export interface ISolution {
    code: string;
    programmingLanguage: string;
    problemId: number;
}

export interface ITestCase {
    fileName: string;
    input: string;
    output: string;
}