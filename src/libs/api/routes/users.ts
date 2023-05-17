import $api from '../';

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

export interface IUser {
    _id: string;
    private?: boolean;
    isRegistered: boolean;
    username?: string;
    nickname?: string;
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
    updatedAt?: Date;
    createdAt?: Date;
}

export type TMargeScopes = 'stats';

export default {
    me(showTokens: boolean = false): [IUser, number, any] {
        return $api.get(`/users/me${showTokens ? '?token=true' : ''}`) as any;
    },
    list(): [IUser[], number, any] {
        return $api.get('/users') as any;
    },
    get(userId: string): [IUser, number, any] {
        return $api.get(`/users/${userId}`) as any;
    },
    create(body: { login: string, email: string, password: string, repeatPassword: string }) {
        return $api.post('/users', { body });
    },
    merge(body: { old: string, now: string, select: string, password?: string, scopes: Array<TMargeScopes> }) {
        return $api.put('/users/merge', { body });
    },
    update(userId: string, body: IUser, type: 'person' | 'default' = 'default') {
        return $api.patch(`/users/${userId}?type=${type}`, { body });
    }
}