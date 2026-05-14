

import { type IAccount } from './account.types';
import { type IProblem } from './problem.types';

export interface ISubmission {
    id: number;
    percentageCorrect: number;
    starterCode: string;
    createdAt: string;
    problem: IProblem;
    account: IAccount;
}