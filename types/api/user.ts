export enum LogCodes {
    Login = 0,
    Logout = 1,
    UpdateProfile = 2,
    UpdatePerson = 3
}

export enum NotficationCodes {}

export type UserPermission = 'self' | 'users' | 'projects' | 'blogs' | 'lists' | 'configs' | 'logs' | 'notifications' | 'site';

export const userPermissions: Array<UserPermission> = [
    'self',
    'users',
    'projects',
    'blogs',
    'lists',
    'configs',
    'logs',
    'notifications',
    'site'
];


export interface Link {
    label: string;
    text?: string;
    icon?: string;
    img?: string;
    url: string;

    updatedAt?: string;
    addedAt?: string;
}

export interface Email {
    email: string;
    enabled: boolean;
    
    addedAt?: string;
}

export interface User {
    _id: string;
    username: string;
    displayName?: string;

    description?: string;
    color?: string;
    links?: Array<Link>;

    emails: Array<Email>;
    password: string;

    permissions: number;

    updatedAt: string;
    createdAt: string;
    expireAt?: string;
}