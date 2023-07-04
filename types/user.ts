export interface IEMail {
    email: string;
    enable: boolean;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface IIp {
    ip: string;
    userAgent: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export enum EPermissions {
    Self = 'self',
    Users = 'users',
    Projects = 'projects',
    Blogs = 'blogs',
    Site = 'site'
};

export interface IButtonPermission {
    label: string;
    text: string;
    value: EPermissions;
    icon: string;
}

export interface ILink {
    label: string;
    text?: string;
    icon?: string;
    img?: string;
    color?: string;
    url: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export interface IUser {
    _id: string;
    private?: boolean;
    isRegistered: boolean;
    username?: string;
    nickname?: string;
    avatar?: string;
    banner?: string;
    description?: string;
    emails?: IEMail[];
    password?: string;
    ips?: IIp[];
    color?: string;
    verified?: boolean;
    permissions?: Array<EPermissions>;
    token?: {
        refresh: string;
        access: string;
    };
    isDeleted?: boolean;
    links?: Array<ILink>;
    updatedAt?: Date;
    createdAt?: Date;
}