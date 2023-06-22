import $api, { DocumentationAPI } from '../';

import { IUser, EPermissions } from './users';

const docs = new DocumentationAPI('configs', {
    path: '/configs',
    label: 'Configs',
    icon: 'configs',
    permissions: [
        EPermissions.Site
    ],
    version: 'beta'
})

export enum EAccountType {
    Steam = 'steam',
    GitHub = 'github',
    Tetr = 'tetr',
    Twitch = 'twitch',
    OSU = 'osu'
}
export interface IAccount {
    key: string;
    enable: boolean;
    type: EAccountType;
}

export type TPageUser = {
    user: {
        _id: string;
        username: string;
        nickname: string;
        avatar: string;
    };
    allowed: boolean;
    updatedAt: Date;
    addedAt: Date;
}
export enum EPageStatus {
    Stable = 'stable',
    Dev = 'dev',
    Beta = 'beta'
}
export interface IPage {
    name: string;
    enabled: boolean;
    users: Array<TPageUser>;
    status: EPageStatus;
    updatedAt?: Date;
    addedAt?: Date;
}

export interface IConfig {
    _id: string;
    name: string;
    user: IUser;
    accounts: Array<IAccount>;
    enable: boolean;
    playingTrack: boolean;
    pages: Array<IPage>;
    status: EPageStatus;
    updatedAt: Date;
    createdAt: Date;
}

export interface IConfigDefault {
    _id: string;
    name: string;
    pages: Array<IPage>;
    status: EPageStatus;
}


class Route {
    constructor() {}

    @docs.route({
        label: 'Get list configs',
        icon: 'configs',
        description: 'Get a complete list of all configurations that are',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 501, text: 'Server error' }
        ]
    })
    list(): [Array<IConfig>, number, any] {
        return $api.get(`/configs`) as any;
    }

    @docs.route({
        label: 'Get config',
        icon: 'settings-alt',
        path: '/:configId',
        description: 'Learn something about a specific configuration',
        params: [
            { name: 'configId', text: 'ConfidId' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such configuration' },
            { code: 501, text: 'Server error' }
        ]
    })
    get(configId: string): [IConfig, number, any] {
        return $api.get(`/configs/${configId}`) as any;
    }

    @docs.route({
        label: 'Get default config',
        icon: 'settings-alt',
        path: '/default',
        statuses: [
            { code: 200, text: 'OK' },
            // { code: 404, text: 'There is no such configuration' },
            { code: 501, text: 'Server error' }
        ]
    })
    default(): [IConfigDefault, number, any] {
        return $api.get(`/configs/default`) as any;
    }

    @docs.route({
        label: 'Create new config',
        icon: 'settings-plus',
        description: 'Create a new configuration (If it is the first one, it will be on automatically)',
        body: [
            { name: 'name', type: 'string', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You didn\'t specify the \'name\' field in \'body\'.' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 501, text: 'Server error' }
        ],
        method: 'POST'
    })
    create(body: IConfig): [IConfig, number, any] {
        return $api.post(`/configs`, { body }) as any;
    }

    @docs.route({
        label: 'Enable config',
        icon: 'settings-check',
        path: '/:configId',
        description: 'Switch to the configuration that you like best',
        params: [
            { name: 'configid', text: 'ConfigId' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such configuration' },
            { code: 501, text: 'Server error' }
        ],
        method: 'PUT'
    })
    enable(configId: string): [IConfig, number, any] {
        return $api.put(`/configs/${configId}`) as any;
    }

    @docs.route({
        label: 'Update config',
        icon: 'pencil',
        path: '/:configId',
        description: 'Update your configuration',
        params: [
            { name: 'configid', text: 'ConfigId' }
        ],
        body: [
            { name: 'name', type: 'string', text: '' },
            { name: 'accounts', type: 'array<ConfigAccount>', text: '' },
            { name: 'playingTrack', type: 'boolean', text: '' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such configuration' },
            { code: 501, text: 'Server error' }
        ],
        method: 'PATCH'
    })
    update(configId: string, body: IConfig): [IConfig, number, any] {
        return $api.patch(`/configs/${configId}`, { body }) as any;
    }

    @docs.route({
        label: 'Delete config or configs',
        icon: 'trash',
        description: 'Delete one or a list of configurations',
        queries: [
            { name: 'ids', type: 'array<string>', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You did not specify the configuration ID' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'More than one config that can be deleted was not found' },
            { code: 501, text: 'Server error' }
        ],
        method: 'DELETE'
    })
    delete(ids: string | Array<string>): [{ deleted: Array<string>, notFound: Array<string> }, number, any] {
        return $api.delete(`/configs?ids=${(Array.isArray(ids) ? ids : [ids]).join(',')}`) as any;
    }
}

export default new Route();