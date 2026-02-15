import { type IAccount } from "../../../entities";

export interface ProblemBuilderDTO {
    title: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    codeTemplates: string;
    testCases: string;
    tags: string[];
    creator: IAccount;
}