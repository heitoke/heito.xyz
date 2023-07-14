import { defineStore, acceptHMRUpdate } from 'pinia';

import type { IConfigDefault } from 'types/api/config';

type Status = 'offline' | 'online' | 'wait';

export const useConfigStore = defineStore('config', {
    state: () => ({
        config: {} as IConfigDefault,
        status: 'wait' as Status
    }),
    actions: {
        set(config: IConfigDefault) {
            this.config = config;
        },
        setStatus(status: Status){
            this.status = status;
        }
    },
    getters: {
        getConfig(state): IConfigDefault {
            return state.config;
        },
        getStatus(state): Status {
            return state.status;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot));
}