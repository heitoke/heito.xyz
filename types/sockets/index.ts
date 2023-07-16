import type { Socket } from 'socket.io-client';

import type { ILog } from '~/types/api/log';
import type { IConfig } from '~/types/api/config';
import type { IUser } from '~/types/api/user';

export interface ServerToClientEvents {
    // ? Server
    'server:cookie'(data: { name: string, value: string, days: number, options?: object }): void;

    // ? Users
    'users:online'(data: { online?: number, list?: Array<IUser> }): void;

    // ? Activities
    'activities:track:playing'(data: object): void;
    'activities:list'(activitiesList: Array<object>): void;

    // ? Notifications
    'notifications:push'(notification: ILog): void;

    // ? Configs
    'configs:update'(config: IConfig): void;
}
  
export interface ClientToServerEvents {
    // ? Users
    'users:online': (type: 'count' | 'list') => void;
    // ? Activities
    'activities:track:playing'(): void;
    'activities:list'(): void;
}

export type TSocket = Socket<ServerToClientEvents, ClientToServerEvents>;