import type { IAccount } from "./account.types";
import type { IMessage } from "./message.types";
import type { IPost, IPostComment } from "./post.types";
import type { IProblem } from "./problem.types";

export interface IReport {
    id: number;
    reporter: IAccount;
    reportedAccount?: IAccount;
    reportedPost?: IPost;
    reportedComment?: IPostComment;
    reportedMessage?: IMessage;
    reportedCodingProblem?: IProblem;
    createdAt: string;
}
