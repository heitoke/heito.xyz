import type { IUser } from "./user";

export interface IComment {
    _id: string;
    user: IUser;
    url?: string;
    content: string;
    window?: {
        width: number;
        height: number;
    };
    position?: {
        x: number;
        y: number;
    };
    reply?: string | IComment;
    likes: number;
    dislikes: number;
    isLiked: boolean;
    isDisliked: boolean;
    updatedAt: Date;
    createdAt: Date;
}

export type TCommentCreate = Omit<IComment, '_id' | 'user' | 'updatedAt' | 'createdAt' | 'likes' | 'dislikes' | 'isLiked' | 'isDisliked'>