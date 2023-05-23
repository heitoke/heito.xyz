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

    @descriptors.addRoute('users', {
        label: 'Get Me',
        icon: 'username',
        path: '/me',
        description: 'Learn more about yourself',
        queries: [
            {
                name: 'token',
                type: 'boolean',
                text: 'Should I show you access and refresh tokens if they have changed?',
                default: 'false'
            }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    me(showTokens: boolean = false): [IUser, number, any] {
        return $api.get(`/users/me${showTokens ? '?token=true' : ''}`) as any;
    }

    @descriptors.addRoute('users', {
        label: 'Get list users',
        icon: 'users',
        description: 'Get a list of users (Filters for easy search will appear soon)',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    list(): [IUser[], number, any] {
        return $api.get('/users') as any;
    }

    @descriptors.addRoute('users', {
        label: 'User ids',
        icon: 'id-card',
        path: '/ids',
        description: 'Shows a list of userIds, needed in order to show the planets on the main page. (May be deleted soon)',
        queries: [
            { name: 'skip', type: 'number', default: '0' },
            { name: 'limit', type: 'number', default: 500 }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    userIds(limit: number = 500) {
        return $api.get(`/users/ids?limit=${limit}`, {});
    }

    @descriptors.addRoute('users', {
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

    @descriptors.addRoute('users', {
        label: 'User authorization',
        icon: 'hand',
        method: 'POST',
        description: 'Log in or register in order not to lose data in the future',
        body: [
            { name: 'login', type: 'string', required: true },
            { name: 'email', type: 'string', required: true },
            { name: 'password', type: 'string', required: true },
            { name: 'repeatPassword', type: 'string', required: true },
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You have not filled in all the required fields' },
            { code: 401, text: 'Password and repeat password do not match' },
            { code: 409, text: 'You already registered' },
            { code: 501, text: 'Server error' }
        ]
    })
    create(body: { login: string, email: string, password: string, repeatPassword: string }) {
        return $api.post('/users', { body });
    }

    @descriptors.addRoute('users', {
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

    @descriptors.addRoute('users', {
        label: 'Update user account',
        icon: 'pencil',
        path: '/:userId',
        description: 'If you want to change another user, not yourself, then you need the right to change other users (Users permission)',
        params: [
            { name: 'userId', text: 'Username, user Id, or mail linked to the user' }
        ],
        queries: [
            { name: 'type', type: 'string', enum: { person: {}, default: {} }, default: 'default' }
        ],
        body: [
            { name: 'private', type: 'boolean', text: '' },
            { name: 'username', type: 'string', text: '' },
            { name: 'nickname', type: 'string', text: '' },
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
    update(userId: string, body: IUser, type: 'person' | 'default' = 'default') {
        return $api.patch(`/users/${userId}?type=${type}`, { body });
    }
}

export default new Route();