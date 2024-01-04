import type { UseFetchOptions } from 'nuxt/app';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Type = 'json';


export interface FetchOptions {
    baseUrl?: string;
    body?: any;
    method?: Method;
    type?: Type;
    headers?: {
        [key: string | symbol]: any;
    };
    token?: string | null;
}


export interface TemplateResponse<TypeStatus, TypeResult = any> {
    name?: string;
    result: TypeResult;
    status: TypeStatus;
}

type PropUnion<T> = {
    [K in keyof T]: TemplateResponse<K, T[K]>
}[keyof T];

type A<T = object> = Array<PropUnion<T>> extends (infer T)[] ? T : never;

export type Response<T extends { [status: number]: any }> = Promise<A<T> | TemplateResponse<501, string>>;

export interface ResponseList<TypeResult = any> {
    total: number;
    pages: number;
    page: number;
    results: Array<TypeResult>;
}


export interface TemplateAPI {
    readonly domain: string;
    readonly token: {
        access: string;
        refresh: string;
    };

    fetch<ResultType = any, ErrorType = any>(uri: string, options: UseFetchOptions<ResultType>): Promise<any>;
}