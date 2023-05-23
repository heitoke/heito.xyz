import { EPermissions } from './routes/users';

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

function getCookie(name: string) {
    let nameEQ = name + '=',
        ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        
        while (c.charAt(0)==' ') c = c.substring(1,c.length);

        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
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
    };
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
export interface ICategory {
    label?: string;
    name: string;
    icon?: string;
    description?: string;
    path: string;
    routes?: Array<IRoute>;
    permissions?: Array<EPermissions>;
    version?: 'stable' | 'beta' | 'disabled';
}

export let categories: Array<ICategory> = [];

export const descriptors = {
    addCategory(options: ICategory) {
        return function(ctor: Function) {
            if (!options.name || categories.find(c => c.name === options.name)) return;

            categories = [...categories || [], {
                version: 'stable',
                ...options,
                routes: []
            }];
        }
    },
    addRoute(categoryName: string, route: IRoute) {
        return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            setTimeout(() => {
                let index = categories?.findIndex(c => c?.name === categoryName);
            
                if (index < 0) return;

                categories[index].routes = [
                    ...categories[index].routes || [],
                    {
                        path: ``,
                        method: 'GET',
                        ...route
                    }
                ];
            }, 100);
        };
    }
}

export default {
    getDomain() {
        try {
            if (window) {
                return import.meta.env.VITE_API_URL as string;
            }
        } catch (err) {
            return process?.env?.VITE_API_URL as string;
        }
    },
    getAccessToken() {
        try {
            if (window) {
                return getCookie('HX_AT') || '';
            }
        } catch (err) {
            return '';
        }
    },
    async fetch(uri: string = '', { body = {}, method = 'GET', json = true, headers = { 'Content-Type': `application/json` }, token = '' }: IFetch) {
        let options: RequestInit = {
                body: (method === 'GET' ? undefined : (json ? JSON.stringify(body) : body) as any),
                headers: {
                    Authorization: `Bearer ${token || this.getAccessToken()}`,
                    ...headers
                },
                mode: 'cors',
                method
            },
            res = await fetch(this.getDomain() + (uri[0] !== '/' ? `/${uri}` : uri), options),
            result = await res.json(),
            props = { ...result };

        delete props['result'];

        return [result?.result || result, await res.status, props];
    },
    async get(uri: string = '', options?: IFetch) {
        return await this.fetch(uri, { ...options, method: 'GET' });
    },
    async post(uri: string = '', options?: IFetch) {
        return await this.fetch(uri, { ...options, method: 'POST' });
    },
    async put(uri: string = '', options?: IFetch) {
        return await this.fetch(uri, { ...options, method: 'PUT' });
    },
    async patch(uri: string = '', options?: IFetch) {
        return await this.fetch(uri, { ...options, method: 'PATCH' });
    },
    async delete(uri: string = '', options?: IFetch) {
        return await this.fetch(uri, { ...options, method: 'DELETE' });
    }
}