import { type IAccount } from "./account.types";

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