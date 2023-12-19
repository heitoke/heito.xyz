import type { FetchOptions, TemplateAPI } from '~/types/api';
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


    async fetch<ResultType = any, ErrorType = string>(uri: string, options: UseFetchOptions<ResultType> & { token?: string | null } = {}) {
        const {
            method = 'get',
            token = `Bearer ${this.token.access}`
        } = options;        

        const response = await useFetch<ResultType>(uri, {
            baseURL: this.domain,
            mode: 'cors',
            ...options as any,

            onRequest({ options }) {
                options.headers = [];

                if (token) options.headers.push(['Authorization', token]);
            },
            onRequestError(ctx) {
                // console.log(2, ctx);
            },
            onResponse(ctx) {
                // console.log(3, ctx);
            },
            onResponseError(ctx) {
                // console.log(4, ctx);
            }
        });

        const data = response.data.value as FetchResult<ResultType>;

        return {
            ...response,
            data: data?.message || data?.result,
            error: {
                ...response.error.value,
                data: response.error.value?.data as ErrorType
            }
        }
    }
}