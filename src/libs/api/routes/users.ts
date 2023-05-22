import $api, { descriptors, categories } from '../';

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

@descriptors.addCategory({ label: 'Users', name: 'users', icon: 'users', path: '/users' })
class Route {
    constructor() {}

    @descriptors.addRoute('users', { label: 'Get Me', icon: 'username', description: 'Learn more about yourself' })
    me(showTokens: boolean = false): [IUser, number, any] {
        return $api.get(`/users/me${showTokens ? '?token=true' : ''}`) as any;
    }

    @descriptors.addRoute('users', { label: 'Get list users', path: '', icon: 'users' })
    list(): [IUser[], number, any] {
        return $api.get('/users') as any;
    }

    @descriptors.addRoute('users', { label: 'User ids', icon: 'id-card', path: '/ids', queries: [{ name: 'limit' }] })
    userIds(limit: number = 500) {
        return $api.fetch(`/users/ids?limit=${limit}`, {});
    }

    @descriptors.addRoute('users', { label: 'Get user', icon: 'id-card', path: '/:userId' })
    get(userId: string): [IUser, number, any] {
        return $api.get(`/users/${userId}`) as any;
    }

    @descriptors.addRoute('users', { label: 'User authorization', icon: 'hand', path: '', method: 'POST' })
    create(body: { login: string, email: string, password: string, repeatPassword: string }) {
        return $api.post('/users', { body });
    }

    @descriptors.addRoute('users', { label: 'Merge accounts', icon: 'merge', path: '/merge', method: 'PUT' })
    merge(body: { old: string, now: string, select: string, password?: string, scopes: Array<TMargeScopes> }) {
        return $api.put('/users/merge', { body });
    }

    @descriptors.addRoute('users', {
        label: 'Update user account',
        icon: 'pencil',
        path: '/:userId',
        queries: [{
            name: 'type',
            enum: {
                default: {},
                person: {}
            }
        }]
    })
    update(userId: string, body: IUser, type: 'person' | 'default' = 'default') {
        return $api.patch(`/users/${userId}?type=${type}`, { body });
    }
}

export default new Route();