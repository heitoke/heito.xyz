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

export interface IButtonPermission {
    label: string;
    text: string;
    value: EPermissions;
    icon: string;
}

export const listPermissions = [
    {
        label: 'Self',
        text: 'Manage yourself',
        value: EPermissions.Self,
        icon: 'heart'
    },
    {
        label: 'Users',
        text: 'Allows you to manage users',
        value: EPermissions.Users,
        icon: 'user-circle'
    },
    {
        label: 'Projects',
        text: 'Allows you to manage projects',
        value: EPermissions.Projects,
        icon: 'lab'
    },
    {
        label: 'Blogs',
        text: 'Allows you to manage blogs',
        value: EPermissions.Blogs,
        icon: 'quill'
    },
    {
        label: 'Site',
        text: 'Allows you to manage the site',
        value: EPermissions.Site,
        icon: 'damage-void'
    }
] as Array<IButtonPermission>;

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

@descriptors.addCategory({
    label: 'Users',
    name: 'users',
    icon: 'users',
    path: '/users',
    version: 'beta'
})
class Route {
    constructor() {}

    @descriptors.addRoute('users', { label: 'Get Me', icon: 'username', path: '/me', description: 'Learn more about yourself' })
    me(showTokens: boolean = false): [IUser, number, any] {
        return $api.get(`/users/me${showTokens ? '?token=true' : ''}`) as any;
    }

    @descriptors.addRoute('users', { label: 'Get list users', icon: 'users' })
    list(): [IUser[], number, any] {
        return $api.get('/users') as any;
    }

    @descriptors.addRoute('users', {
        label: 'User ids',
        icon: 'id-card',
        path: '/ids',
        queries: [{
            name: 'limit',
            type: 'number'
        }]
    })
    userIds(limit: number = 500) {
        return $api.get(`/users/ids?limit=${limit}`, {});
    }

    @descriptors.addRoute('users', { label: 'Get user', icon: 'id-card', path: '/:userId' })
    get(userId: string): [IUser, number, any] {
        return $api.get(`/users/${userId}`) as any;
    }

    @descriptors.addRoute('users', { label: 'User authorization', icon: 'hand', method: 'POST' })
    create(body: { login: string, email: string, password: string, repeatPassword: string }) {
        return $api.post('/users', { body });
    }

    @descriptors.addRoute('users', {
        label: 'Merge accounts',
        icon: 'merge',
        path: '/merge',
        body: [
            { name: 'old', type: 'string', text: 'User ID' },
            { name: 'now', type: 'string', text: 'User ID' },
            { name: 'select', type: 'string', text: 'User ID', required: true },
            { name: 'password', type: 'string', text: 'User password' },
            { name: 'scopes', type: 'string', text: 'Scopes' }
        ],
        params: [
            { name: 'username', type: 'string', text: 'User username' }
        ],
        queries: [
            { name: 'type', type: 'string', text: 'Param', enum: { test: { type: 'string' } } }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 201, text: 'kdkj asdjas kdljasd jasldkjas ldkjasdlj askldjas ' }
        ],
        permissions: [EPermissions.Users, EPermissions.Projects],
        method: 'PUT'
    })
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
                default: { type: 'string' },
                person: { type: 'string' }
            }
        }],
        method: 'PATCH'
    })
    update(userId: string, body: IUser, type: 'person' | 'default' = 'default') {
        return $api.patch(`/users/${userId}?type=${type}`, { body });
    }
}

export default new Route();