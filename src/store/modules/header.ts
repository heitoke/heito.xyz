import type { StoreOptions } from 'vuex';

export interface ILoading {
    color?: string;
    process?: number;
}

export interface IOptions {
    blur: {
        enable: boolean;
        value: string;
    }
}

export let defaultOptions: IOptions = {
    blur: {
        enable: true,
        value: '5px'
    }
}

interface State {
    loading: ILoading;
    options: IOptions;
}

const module: StoreOptions<State> = {
    state: {
        loading: {
            color: '',
            process: 0
        },
        options: defaultOptions
    },
    mutations: {
        'header:loading:set'(state: State, loading: ILoading) {
            state.loading = loading;
        },
        'header:options:set'(state: State, options: IOptions) {
            state.options = { ...defaultOptions, ...options }
        }
    },
    actions: {
        setHeaderLoading({ commit }, loading: ILoading) {
            return commit('header:loading:set', loading);
        },
        setHeaderOptions({ commit }, options: IOptions) {
            return commit('header:options:set', options);
        }
    },
    getters: {
        getHeaderLoading(state: State): ILoading {
            return state.loading;
        },
        getHeaderOptions(state: State): IOptions {
            return state.options;
        }
    }
}

export default module;