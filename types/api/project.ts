import type { IUser } from "./user";

export interface ILink {
    label: string;
    text: string;
    icon: string;
    img: string;
    color: string;
    url: string;
    updatedAt: Date;
    createdAt: Date;
}

export enum EProjectPermission {
    Member = 'member',
    Moderator = 'moderator',
    Admin = 'admin',
    Owner = 'owner'
}

export interface IProjectMember {
    member: IUser;
    permission: EProjectPermission;
    updatedAt: Date;
    joinedAt: Date;
}

export interface IProject {
    _id: string;
    private?: boolean;
    name?: string;
    displayName?: string;
    image?: string;
    banner?: string;
    description?: string;
    color?: string;
    verified?: boolean;
    isDeleted?: boolean;
    members?: Array<IProjectMember>;
    links?: Array<ILink>;
    tags?: Array<String>;
    updatedAt?: Date;
    createdAt?: Date;
}