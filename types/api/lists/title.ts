import type { IUser } from "../user";

export interface IListTitle {
    _id: string;
    name: string;
    title: string;
    user: IUser;
    description: string;
    image: string;
    category: string;
    updatedAt: Date;
    createdAt: Date;
}