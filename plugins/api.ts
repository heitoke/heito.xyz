import type { FetchOptions, TemplateAPI } from '~/types/api';

// * Routes
import Auth from '~/services/api/auth';
import Users from '~/services/api/users';



export class API implements TemplateAPI {
    private _domain: string;
    
    private _accessToken: string;
    private _refreshToken: string;

    constructor(domain: string, accessToken: string, refreshToken: string) {
        this._domain = domain;

        this._accessToken = accessToken;
        this._refreshToken = refreshToken;
    }


    get domain() {
        return this._domain;
    }

    get token() {
        return {
            access: this._accessToken,
            refresh: this._refreshToken
        }
    }


    setDomain(domain: string) {
        this._domain = domain;
    }

    setAccessToken(token: string) {
        this._accessToken = token;
    }

    setRefreshToken(token: string) {
        this._refreshToken = token;
    }


    async fetch(uri: string, options: FetchOptions = {}): Promise<any> {
        const {
            body = {},
            headers = {
                'Content-Type': 'application/json'
            },
            type = 'json',
            method = 'GET',
            token = `Bearer ${this.token.access}`
        } = options;

        const url = this.domain + (uri[0] === '/' ? '' : '/') + uri;

        if (token) headers['Authorization'] = token;

        try {
            const response = await fetch(url, {
                body: method === 'GET' ? undefined : (type === 'json' ? JSON.stringify(body) : body),
                headers,
                mode: 'cors',
                method
            });

            const
                text = await response.text(),
                result = text === '' ? null : JSON.parse(text);

            return {
                name: result?.name || undefined,
                result: result?.message || result?.result || null,
                status: response.status || 501
            }
        } catch (error) {
            console.error('FETCH ERROR', error);

            return {
                result: null,
                status: 501
            }
        }
    }


    get(uri: string, options?: FetchOptions) {
        return this.fetch(uri, { ...options, headers: {}, method: 'GET' });
    }

    post(uri: string, options?: FetchOptions) {
        return this.fetch(uri, { ...options, method: 'POST' });
    }

    patch(uri: string, options?: FetchOptions) {
        return this.fetch(uri, { ...options, method: 'PATCH' });
    }

    put(uri: string, options?: FetchOptions) {
        return this.fetch(uri, { ...options, method: 'PUT' });
    }

    delete(uri: string, options?: FetchOptions) {
        return this.fetch(uri, { ...options, method: 'DELETE' });
    }
}


export default defineNuxtPlugin(nuxtApp => {
    const { apiURL } = nuxtApp.$config.public;

    const api = new API(apiURL, cookies?.get('HX_AT') || '', cookies?.get('HX_RT') || '');

    const
        auth = new Auth(api),
        users = new Users(api);

    return {
        provide: {
            api: {
                api,
                auth,
                users
            }
        }
    }
});