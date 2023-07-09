import { defineStore, acceptHMRUpdate } from 'pinia';

import type { IConfigDefault } from 'types/api/config';

export const useConfigStore = defineStore('config', {
    state: () => ({
        config: {} as IConfigDefault
    }),
    actions: {
        set(config: IConfigDefault) {
            this.config = config;
        }
    },
    getters: {
        getConfig(state): IConfigDefault {
            return state.config;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot));
}