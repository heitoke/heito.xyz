import type { FetchOptions, TemplateAPI, Response } from '~/types/api';
import type { UseFetchOptions } from 'nuxt/app';


interface FetchError<T = any> {
    data?: T;
    statusCode: number;
}

interface FetchResult<T = any> {
    name?: string;
    code: number;
    result: T;
    message: T;
}


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
    

    getQuery(object: { [key: string | number]: string | number | boolean | Array<string | number | boolean> }) {
        const query = new URLSearchParams();

        if (Object.keys(object).length < 1) return '';

        for (const key in object) {
            if (Array.isArray(object[key])) {
                for (const item of object[key] as Array<any>) {
                    query.append(key, String(item));
                }

                continue;
            }

            query.append(key, String(object[key]));
        }

        return String(query);
    }

    async fetch<ResultType = any, ErrorType = string>(uri: string, option: FetchOptions = {}): Promise<Response<ResultType, ErrorType>> {
        const {
            body = {},
            query = {},
            headers = {},
            type = 'json',
            method = 'GET',
            token = this.token.access
        } = option;

        const url = this.domain + (uri[0] === '/' ? '' : '/') + uri;

        if (token) headers['Authorization'] = `Bearer ${token}`;

        return fetch(url + '?' + this.getQuery(query), {
            body: method === 'GET' ? undefined : (type === 'json' ? JSON.stringify(body) : body) as any,
            headers: Object.assign(method === 'GET' ? {} : {
                'Content-Type': 'application/json'
            }, headers),
            mode: 'cors',
            method
        }).then(async res => {
            const result = await res.json();

            return {
                ok: res.ok,
                status: res.status,
                data: result?.message || result?.result
            }
        }).catch(reason => {
            console.error(`FETCH ERROR:`, reason);
            
            return {
                ok: false,
                status: 501,
                data: 'Server Error' as any
            }
        });
    }
}