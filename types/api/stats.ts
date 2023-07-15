export interface IEditor {
    decimal: string;
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
    color: string;
}

export interface IProject {
    badge: null;
    clients: Array<Object>;
    color: string | null;
    created_at: string;
    has_public_url: boolean;
    human_readable_last_heartbeat_at: string;
    id: string;
    last_heartbeat_at: string;
    name: string;
    repository: any,
    url: string;
    urlencoded_name: string;

    isActive: boolean;
    isLoading: boolean;
    data: object;
}

export interface ILang {
    decimal: string;
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    seconds: number;
    text: string;
    total_seconds: number;
}


export const replaceImageLanguage: { [key: string]: string } = {
    'c#': 'csharp',
    'c++': 'cpp'
};