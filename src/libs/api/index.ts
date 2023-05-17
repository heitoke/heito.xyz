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