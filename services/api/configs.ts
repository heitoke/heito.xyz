import type { API } from '.';
import type { Response, ResponseList } from '~/types/api';

// * Types
import type { Config } from '~/types/api/config';


export default class Route {
    private api;

    constructor(api: API) {
        this.api = api;
    }


    list(skip: number = 0, limit: number = 64) {
        return this.api.fetch<ResponseList<Config>>(`/configs`, {
            query: {
                skip,
                limit
            }
        });
    }

    default() {
        return this.api.fetch<Config>('/configs/default');
    }

    get(configId: string) {
        return this.api.fetch<Config>(`/configs/${configId}`);
    }


    create(name: string) {
        return this.api.fetch<Config>('/configs', {
            body: { name },
            method: 'POST'
        });
    }


    switch(configId: string) {
        return this.api.fetch<string>(`/configs/${configId}`, {
            method: 'PUT'
        });
    }


    delete(configId: string) {
        return this.api.fetch<string>(`/configs/${configId}`, {
            method: 'DELETE'
        });
    }
}