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

export type ResponseList<TypeResult = any> = Response<{
    200: {
        total: number;
        pages: number;
        page: number;
        results: Array<TypeResult>;
    }
}>;


export type TemplateAPI = {
    readonly domain: string;
    readonly token: {
        access: string;
        refresh: string;
    };
} & Record<'fetch' | 'get' | 'post' | 'patch' | 'put' | 'delete', (uri: string, options: FetchOptions) => Response<{ [key: string]: any }>>;