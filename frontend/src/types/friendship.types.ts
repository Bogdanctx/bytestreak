import { type IAccount } from "./account.types";

export interface IFriendship {
    id: number;
    account1: IAccount;
    account2: IAccount;
    friendsSince: string;
}
