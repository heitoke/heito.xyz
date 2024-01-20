import type { UseFetchOptions } from 'nuxt/app';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Type = 'json';


export interface FetchOptions {
    baseUrl?: string;
    body?: any;
    query?: {
        [key: string | number]: string | number | boolean | Array<string | number | boolean>;
    };
    method?: Method;
    type?: Type;
    headers?: {
        [key: string | symbol]: any;
    };
    token?: string | null;
}


interface TemplateResponse<TypeOK = boolean> {
    ok: TypeOK;
    status: number;
}

interface SuccessResponse<ResultType = any> extends TemplateResponse<true> {
    data: ResultType;
}

interface ErrorResponse<ErrorType = string> extends TemplateResponse<false> {
    data: ErrorType;
}

export type Response<ResultType = any, ErrorType = string> = SuccessResponse<ResultType> | ErrorResponse<ErrorType>;

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

    fetch<ResultType = any, ErrorType = any>(uri: string, options: FetchOptions): Promise<Response>;
}