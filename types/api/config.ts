import type { User } from './user';

export enum LogCodes {}

export enum NotficationCodes {}


export enum AccountType {
    Steam = 'steam',
    GitHub = 'github',
    Tetr = 'tetr',
    Twitch = 'twitch',
    OSU = 'osu',
    Telegram = 'telegram',
    Discord = 'discord'
}

export interface Account {
    type: AccountType;
    key: string;
    enabled: boolean;
}

export interface PageUser {
    user: User;
    allowed: boolean;

    updatedAt?: string;
    addedAt?: string;
}

export interface Page {
    name: string;

    users: Array<PageUser>;
    enabled: boolean;

    updatedAt?: string;
    addedAt?: string;
}

export interface Config {
    _id: string;
    name: string;

    user: User;

    accounts: Array<Account>;
    pages: Array<Page>;

    playingTrack: boolean;
    enabled: boolean;

    updatedAt: string;
    createdAt: string;
}