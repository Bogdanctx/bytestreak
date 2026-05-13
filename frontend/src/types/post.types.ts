import { type IAccount } from "./account.types";
import { type IAttachment } from "./message.types";

export interface IPostComment {
    id: number | null;
    author: IAccount;
    text: string;
    attachments: IAttachment[];
    createdAt: string
}

export interface IPost {
    id: number | null;
    author: IAccount;
    text: string;
    attachments: IAttachment[];
    createdAt: string
    comments: IPostComment[];
}
