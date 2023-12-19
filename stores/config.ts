import { defineStore, acceptHMRUpdate } from 'pinia';

export const useConfigStore = defineStore('config', () => {
    return {};
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot));
}