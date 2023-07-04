import type { IFetch, ICategory, ICategoryOptions, IRoute } from 'types/api';

type TE = Promise<[any, number, object]>;

interface IAPI {
    readonly domain: string;
    readonly accessToken: string;

    readonly categories: Array<ICategory>;

    fetch(uri: string, options: IFetch): TE;

    get(uri: string, options?: IFetch): TE;
    post(uri: string, options?: IFetch): TE;
    patch(uri: string, options?: IFetch): TE;
    put(uri: string, options?: IFetch): TE;
    delete(uri: string, options?: IFetch): TE;
}

export let categories: Array<ICategory> = [];

export class DocumentationAPI {
    readonly name: string;
    readonly options: ICategoryOptions;

    constructor(name: string, options: ICategoryOptions) {
        this.name = name;
        this.options = options;

        this.initCategory();
    }

    private initCategory() {
        if (!this.name || categories.find(c => c.name === this.name)) return;

        categories = [...categories || [], {
            version: 'stable',
            ...this.options,
            name: this.name,
            routes: []
        }];
    }

    route(route: IRoute) {
        const name = this.name;

        return function(target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
            const categoryIndex = categories?.findIndex(c => c?.name === name);

            if (categoryIndex < 0) return;

            categories[categoryIndex].routes = [
                ...categories[categoryIndex].routes || [],
                {
                    path: ``,
                    method: 'GET',
                    ...route
                }
            ];
        };
    }
}

class API implements IAPI {
    domain: string;
    accessToken: string;

    categories: Array<ICategory> = categories;

    constructor(domain: string, accessToken: string) {
        this.domain = domain;
        this.accessToken = accessToken;
    }

    async fetch(uri: string, { body = {}, method = 'GET', json = true, headers = { 'Content-Type': `application/json` }, token = '' }: IFetch): TE {   
        const options: RequestInit = {
            body: method === 'GET' ? undefined : (json ? JSON.stringify(body) : body) as any,
            headers: {
                Authorization: `Bearer ${token || this.accessToken}`,
                ...headers
            },
            mode: 'cors',
            method
        };

        try {
            const res = await fetch(this.domain + (uri[0] !== '/' ? '/' : '') + uri.slice(1), options);

            const
                result = await res.json(),
                props = { ...result };

            if (props?.token?.guast) cookies.set('HX_GUAST', props?.token?.guast, { days: 365 });

            delete props['result'];

            return [result?.result || result, await res.status, props];
        } catch (error) {
            console.error('ERROR', error);

            return [{ message: 'Failed to connect to the server' }, 501, {}];
        }
    }

    get(uri: string = '', options?: IFetch) {
        return this.fetch(uri, { ...options, method: 'GET' });
    }

    post(uri: string = '', options?: IFetch) {
        return this.fetch(uri, { ...options, method: 'POST' });
    }

    put(uri: string = '', options?: IFetch) {
        return this.fetch(uri, { ...options, method: 'PUT' });
    }
    
    patch(uri: string = '', options?: IFetch) {
        return this.fetch(uri, { ...options, method: 'PATCH' });
    }

    delete(uri: string = '', options?: IFetch) {
        return this.fetch(uri, { ...options, method: 'DELETE' });
    }
}

export default defineNuxtPlugin({
    name: 'api',
    parallel: true,
    async setup(nuxtApp) {
        const api = new API(nuxtApp.$config.public.apiURL || '', cookies.get('HX_AT') || cookies.get('HX_GUAST') || '');

        return { provide: { api } };
    }
});

declare module '#app' {
    interface NuxtApp {
        $api: IAPI;
    }
}
  
declare module 'vue' {
    interface ComponentCustomProperties {
        $api: IAPI;
    }
}