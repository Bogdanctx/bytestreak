import { type IAccount } from "../entities";

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