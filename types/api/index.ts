export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Type = 'json';

export interface TemplateAPI {
    readonly domain: string;
    readonly token: {
        access: string;
        refresh: string;
    };
}