import type { IUser } from "./user";

export interface IBlogContentChildren {
    text?: string;
    images?: Array<string>;
    size: number;
    right?: boolean;
    bottom?: boolean;
}

export interface IBlogContent {
    size: number;
    childrens: Array<Array<IBlogContentChildren>>;
}

export type TBlogUserLike = {
    user: IUser;
    ratedAt: Date;
}

export interface IBlog {
    _id: string;
    name: string;
    title: string;
    image: string;
    description: string;
    author: IUser;
    content: Array<Array<IBlogContent>>;
    category: string;
    likes: number;
    dislikes: number;
    isLiked: boolean;
    isDisliked: boolean;
    updatedAt: Date;
    createdAt: Date;
}