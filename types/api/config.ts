import type { IUser } from "./user";

export enum EAccountType {
    Steam = 'steam',
    GitHub = 'github',
    Tetr = 'tetr',
    Twitch = 'twitch',
    OSU = 'osu',
    Telegram = 'telegram',
    Discord = 'discord'
}
export interface IAccount {
    key: string;
    enable: boolean;
    type: EAccountType;
}

export type TPageUser = {
    user: {
        _id: string;
        username: string;
        nickname: string;
        avatar: string;
    };
    allowed: boolean;
    updatedAt: Date;
    addedAt: Date;
}
export enum EPageStatus {
    Stable = 'stable',
    Dev = 'dev',
    Beta = 'beta'
}
export interface IPage {
    name: string;
    enabled: boolean;
    users: Array<TPageUser>;
    status: EPageStatus;
    updatedAt?: Date;
    addedAt?: Date;
}

export interface IConfig {
    _id: string;
    name: string;
    user: IUser;
    accounts: Array<IAccount>;
    enable: boolean;
    playingTrack: boolean;
    pages: Array<IPage>;
    status: EPageStatus;
    updatedAt: Date;
    createdAt: Date;
}

export interface IConfigDefault {
    _id: string;
    name: string;
    pages: Array<IPage>;
    status: EPageStatus;
}
