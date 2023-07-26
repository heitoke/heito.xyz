import type { IUser } from "../user";

export interface IListCategory {
    name: string;
    label: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface IList {
    _id: string;
    name: string;
    title: string;
    user: IUser;
    description: string;
    image: string;
    categories: Array<IListCategory>;
    updatedAt: Date;
    createdAt: Date;
}