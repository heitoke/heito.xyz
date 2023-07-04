import type { IUser } from "./user";

export enum ESessionType {
    Access = 'access',
    Refresh = 'refresh',
    GuastToken = 'guast_token'
}

export interface ISession {
    _id: string;
    user: IUser;
    token: string;
    ip: string;
    userAgent: string;
    type: ESessionType;
    refresh: ISession;
    updatedAt: Date;
    createdAt: Date;
}