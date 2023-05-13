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
    token?: {
        refresh: string;
        access: string;
    };
    updatedAt?: Date;
    createdAt?: Date;
}

export default {
    me(showTokens: boolean = false): [IUser, number] {
        return $api.get(`/users/me${showTokens ? '?token=true' : ''}`) as any;
    },
    list(): [IUser[], number] {
        return $api.get('/users') as any;
    },
    get(userId: string): [IUser, number] {
        return $api.get(`/users/${userId}`) as any;
    },
    create(body: { login: string, email: string, password: string, repeatPassword: string }) {
        return $api.post('/users', { body });
    }
}