import { defineStore, acceptHMRUpdate } from 'pinia';

import type { IConfig } from 'types/api/config';

export const useConfigStore = defineStore('config', {
    state: () => ({
        config: {} as IConfig
    }),
    actions: {
        set(config: IConfig) {
            this.config = config;
        }
    },
    getters: {
        getConfig(state): IConfig {
            return state.config;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot));
}