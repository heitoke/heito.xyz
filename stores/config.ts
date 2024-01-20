import { defineStore, acceptHMRUpdate } from 'pinia';

import type { Config } from '~/types/api/config';

export const useConfigStore = defineStore('config', () => {
    const _config = ref<Config>();

    
    const { $api } = useNuxtApp();


    // * Getters
    const config = computed(() => _config.value);


    // * Functions
    async function fetchDefaultConfig() {
        const { ok, data } = await $api.configs.default();
    
        if (!ok) return null;

        _config.value = data;

        return data;
    }


    return {
        config,

        fetchDefaultConfig
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot));
}