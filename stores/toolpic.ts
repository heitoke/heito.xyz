import { defineStore, acceptHMRUpdate } from 'pinia';

export const useToolpicStore = defineStore('toolpic', () => {
    return {};
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useToolpicStore, import.meta.hot));
}