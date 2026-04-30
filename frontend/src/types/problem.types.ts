import { type IAccount } from "./account.types";

export interface IProblem {
    id: number;
    title: string;
    slug: string;
    description: string;
    problemDifficulty: "EASY" | "MEDIUM" | "HARD";
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
}

export interface IProblemCreateDTO {
    title: string;
    description: string;
    problemDifficulty: "EASY" | "MEDIUM" | "HARD";
    codeTemplates: string;
    testCases: string;
    tags: string[];
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
    executionTime: number;
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