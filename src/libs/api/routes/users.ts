import $api, { DocumentationAPI } from '../';

import { ILog } from './logs';
import { IProject } from './projects';

const docs = new DocumentationAPI('users', {
    path: '/users',
    label: 'Users',
    icon: 'users',
    version: 'beta'
});

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

export type TMargeScopes = 'stats';

export interface IUserFilters {
    skip?: number;
    limit?: number;
    fields?: Array<string>;
    by?: Array<string>;
    text?: string;
    sort?: 'date' | 'name';
    order?: boolean;
}

const enumForBy = ['_id', 'private', 'isRegistered', 'username', 'nickname', 'color', 'verified', 'permissions', 'isDeleted', 'updatedAt', 'createdAt'];

class Route {
    constructor() {}

    @docs.route({
        label: 'Get Me',
        icon: 'username',
        path: '/me',
        description: 'Learn more about yourself',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    me(token: string = ''): [IUser, number, any] {
        return $api.get(`/users/me`, { token }) as any;
    }

    @docs.route({
        label: 'Get list users',
        icon: 'users',
        description: 'Get a list of users (Filters for easy search will appear soon)',
        queries: [
            { name: 'skip', type: 'number', text: '', default: '0' },
            { name: 'limit', type: 'number', text: '', default: '16' },
            { name: 'fields', type: 'string', text: '', enum: enumForBy },
            { name: 'by', type: 'string', text: '', default: 'username,nickname', enum: enumForBy },
            { name: 'text', type: 'string', text: '' },
            { name: 'sort', type: 'string', text: '', default: 'date', enum: { date: {}, name: {} } },
            { name: 'order', type: 'boolean', text: '', default: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    list({ skip = 0, limit = 16, fields = [], by = ['username', 'nickname'], text = '', sort = 'date', order = true }: IUserFilters = {}): [{ count: number, results: IUser[] }, number, any] {
        return $api.get(`/users?skip=${skip || 0}&limit=${limit || 0}&fields=${fields.join(',')}&by=${by.join(',')}&text=${text || ''}&sort=${sort || 'date'}&order=${order}`) as any;
    }

    @docs.route({
        label: 'Get user',
        icon: 'id-card',
        path: '/:userId',
        description: 'Find out information about a specific user',
        params: [
            { name: 'userId', text: 'Username, user Id, or mail linked to the user' }
        ],
        permissions: [EPermissions.Users],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'Not found' },
            { code: 501, text: 'Server error' }
        ]
    })
    get(userId: string): [IUser, number, any] {
        return $api.get(`/users/${userId}`) as any;
    }

    @docs.route({
        label: 'Merge accounts',
        icon: 'merge',
        path: '/merge',
        description: 'Merge two accounts into one and merge their data into a single whole',
        body: [
            { name: 'old', type: 'string', text: 'UserId', required: true },
            { name: 'now', type: 'string', text: 'UserId', required: true },
            { name: 'select', type: 'string', text: 'The User Id that was selected as the main one from old or now', required: true },
            { name: 'password', type: 'string', text: 'The password from the user who will be the main one in the future (If there is one)' },
            { name: 'scopes', type: 'array', text: 'Scopes' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You have not filled in all the required fields' },
            { code: 401, text: 'Not one of the provided users is equal to the select field' },
            { code: 403, text: 'The password and password repetition do not match' },
            { code: 404, text: 'One of the two was not found by the user' },
            { code: 501, text: 'Server error' }
        ],
        method: 'PUT'
    })
    merge(body: { old: string, now: string, select: string, password?: string, scopes: Array<TMargeScopes> }) {
        return $api.put('/users/merge', { body });
    }

    @docs.route({
        label: 'Update user account',
        icon: 'pencil',
        path: '/:userId',
        description: 'If you want to change another user, not yourself, then you need the right to change other users (Users permission)',
        params: [
            { name: 'userId', text: 'Username, user Id, or mail linked to the user' }
        ],
        queries: [
            { name: 'type', type: 'string', enum: { person: {}, default: {}, links: {} }, default: 'default' }
        ],
        body: [
            { name: 'private', type: 'boolean', text: '' },
            { name: 'username', type: 'string', text: '' },
            { name: 'nickname', type: 'string', text: '' },
            { name: 'avatar', type: 'string', text: 'URL' },
            { name: 'banner', type: 'string', text: 'URL' },
            { name: 'description', type: 'string', text: 'Max length - 512' },
            { name: 'color', type: 'string', text: '' },
            { name: 'verified', type: 'boolean', text: '', permissions: [EPermissions.Users] },
            { name: 'permissions', type: 'string', text: '', permissions: [EPermissions.Users] },
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such user' },
            { code: 501, text: 'Server error' }
        ],
        permissions: [EPermissions.Users],
        method: 'PATCH'
    })
    update(userId: string, body: IUser, type: 'person' | 'default' | 'links' = 'default') {
        return $api.patch(`/users/${userId}?type=${type}`, { body });
    }

    @docs.route({
        label: 'Get user list notifications',
        icon: 'notification',
        path: '/:userId/notifications',
        // description: 'Find out information about a specific user',
        params: [
            { name: 'userId', text: 'Username, user Id, or mail linked to the user' }
        ],
        permissions: [EPermissions.Users],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'Not found' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 501, text: 'Server error' }
        ]
    })
    notifications(userId: string): [{ count: number, results: Array<ILog> }, number, any] {
        return $api.get(`/users/${userId}/notifications`) as any;
    }

    @docs.route({
        label: 'Get user projects',
        icon: 'images',
        path: '/:userId/projects',
        // description: 'Find out information about a specific user',
        params: [
            { name: 'userId', text: 'Username, user Id, or mail linked to the user' }
        ],
        permissions: [EPermissions.Users, EPermissions.Projects],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    projects(userId: string): [{ count: number, results: Array<IProject> }, number, any] {
        return $api.get(`/users/${userId}/projects`) as any;
    }
}

export default new Route();