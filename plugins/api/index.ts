import type { IFetch, ICategory, ICategoryOptions, IRoute } from 'types/api';

import { categories } from '~/libs/docs';

import Auth from './routes/auth';
import Blogs from './routes/blogs';
import Configs from './routes/configs';
import Logs from './routes/logs';
import Music from './routes/music';
import Projects from './routes/projects';
import Users from './routes/users';
import Comments from './routes/comments';
import Lists from './routes/lists';

type TE = Promise<[any, number, object]>;

export interface IAPI {
    readonly domain: string;
    readonly accessToken: string;

    readonly categories: Array<ICategory>;

    fetch(uri: string, options: IFetch): TE;

    get(uri: string, options?: IFetch): TE;
    post(uri: string, options?: IFetch): TE;
    patch(uri: string, options?: IFetch): TE;
    put(uri: string, options?: IFetch): TE;
    delete(uri: string, options?: IFetch): TE;

    auth: Auth;
    blogs: Blogs;
    configs: Configs;
    logs: Logs;
    music: Music;
    projects: Projects;
    users: Users;
    comments: Comments;
    lists: Lists;
}


export class API implements IAPI {
    domain: string;
    accessToken: string;

    categories: Array<ICategory> = categories;

    auth: Auth = new Auth(this);
    blogs: Blogs = new Blogs(this);
    configs: Configs = new Configs(this);
    logs: Logs = new Logs(this);
    music: Music = new Music(this);
    projects: Projects = new Projects(this);
    users: Users = new Users(this);
    comments: Comments = new Comments(this);
    lists: Lists = new Lists(this);

    constructor(domain: string, accessToken: string) {
        this.domain = domain;
        this.accessToken = accessToken;
    }

    async fetch(uri: string, { body = {}, method = 'GET', json = true, headers = { 'Content-Type': `application/json` }, token = '' }: IFetch): TE {   
        try {
            const res = await fetch(this.domain + (uri[0] === '/' ? '' : '/') + uri, {
                body: method === 'GET' ? undefined : (json ? JSON.stringify(body) : body) as any,
                headers: {
                    Authorization: `Bearer ${token || this.accessToken}`,
                    ...headers
                },
                mode: 'cors',
                method
            });

            const
                result = await res.json(),
                props = { ...result };

            if (props?.token?.guast && process.client) cookies.set('HX_GUAST', props?.token?.guast, { days: 365 });

            delete props['result'];

            return [result?.result || result, res.status || 501, props];
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
        const api = new API(nuxtApp.$config.public.apiURL || '', cookies?.get('HX_AT') || cookies?.get('HX_GUAST') || '');

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