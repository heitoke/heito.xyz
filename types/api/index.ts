import type { EPermissions } from "./user";

export type TMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IFetch {
    body?: {
        [key: string | symbol]: any
    };
    method?: TMethod;
    json?: boolean;
    headers?: {
        [key: string | symbol]: string;
    };
    token?: string;
}

type TTypes = 'string' | 'boolean' | 'number' | string;

export interface IQuery {
    name: string;
    type?: TTypes,
    text?: string;
    default?: any;
    enum?: {
        [key: string]: {
            label?: string;
            value?: string;
            type?: TTypes;
        }
    } | Array<string>;
    permissions?: Array<EPermissions>;
    required?: boolean;
}

export interface IRoute {
    label: string;
    icon?: string;
    description?: string;
    path?: string;
    params?: Array<IQuery>;
    queries?: Array<IQuery>;
    body?: Array<IQuery>;
    method?: 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT' | 'DELETE';
    statuses?: Array<{
        code: number;
        text: string;
    }>;
    permissions?: Array<EPermissions>;
}

export interface ICategoryOptions {
    label?: string;
    icon?: string;
    description?: string;
    path: string;
    routes?: Array<IRoute>;
    permissions?: Array<EPermissions>;
    version?: 'stable' | 'beta' | 'disabled';
}

export interface ICategory extends ICategoryOptions {
    name: string;
}