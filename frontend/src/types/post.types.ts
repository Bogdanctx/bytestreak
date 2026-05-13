import { type IAccount } from "./account.types";
import { type IAttachment } from "./message.types";

export interface IPostComment {
    id: number | null;
    author: IAccount;
    text: string;
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

export interface IPostDTO {
    text: string;
    attachments: IAttachment[];
}

export interface IPostCommentDTO {
    text: string;
}
