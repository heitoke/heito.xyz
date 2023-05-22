import $api, { descriptors, categories } from '../';

import { IUser } from './users';

export enum EAccountType {
    Steam = 'steam',
    GitHub = 'github',
    Tetr = 'tetr'
}
export interface IAccount {
    key: string;
    enable: boolean;
    type: EAccountType;
}

export interface IConfig {
    _id: string;
    name: string;
    user: IUser;
    accounts: Array<IAccount>;
    enable: boolean;
    playingTrack: boolean;
    updatedAt: Date;
    createdAt: Date;
}

@descriptors.addCategory({ label: 'Configs', name: 'configs', icon: 'configs', path: '/configs' })
class Route {
    constructor() {}

    @descriptors.addRoute('configs', { label: 'Get list configs' })
    list(): [Array<IConfig>, number, any] {
        return $api.get(`/configs`) as any;
    }

    @descriptors.addRoute('configs', { label: 'Get config' })
    get(configId: string): [IConfig, number, any] {
        return $api.get(`/configs/${configId}`) as any;
    }

    @descriptors.addRoute('configs', { label: 'Create new config', method: 'POST' })
    create(body: IConfig): [IConfig, number, any] {
        return $api.post(`/configs`, { body }) as any;
    }

    @descriptors.addRoute('configs', { label: 'Enable config', method: 'PUT' })
    enable(configId: string): [IConfig, number, any] {
        return $api.put(`/configs/${configId}`) as any;
    }

    @descriptors.addRoute('configs', { label: 'Update config', icon: 'pencil', method: 'PATCH' })
    update(configId: string, body: IConfig): [IConfig, number, any] {
        return $api.patch(`/configs/${configId}`, { body }) as any;
    }

    @descriptors.addRoute('configs', { label: 'Delete config or configs', icon: 'trash', method: 'DELETE' })
    delete(configsIds: string | Array<string>): [{ deleted: Array<string>, notFound: Array<string> }, number, any] {
        return $api.delete(`/configs?ids=${(typeof configsIds === 'string' ? [configsIds] : configsIds).join(',')}`) as any;
    }
}

export default new Route();