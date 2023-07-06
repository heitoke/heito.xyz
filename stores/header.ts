import { defineStore, acceptHMRUpdate } from 'pinia';

import { EPermissions, IUser } from 'types/api/user';

export interface ILoading {
    color: string;
    process: number;
}

export interface IOptions {
    blur: {
        enable: boolean;
        value: string;
    }
}

export const defaultOptions: IOptions = {
    blur: {
        enable: true,
        value: '5px'
    }
}

export const useHeaderStore = defineStore('header', {
    state: () => ({
        loading: {
            color: '',
            process: 0
        } as ILoading,
        options: defaultOptions
    }),
    actions: {
        setLoading(loading: ILoading) {
            this.loading = loading;
        },
        setOptions(options: IOptions) {
            this.options = options;
        }
    },
    getters: {
        getLoading(state): ILoading {
            return state.loading;
        },
        getOptions(state): IOptions {
            return state.options
        }
    }
});