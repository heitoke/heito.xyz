import { defineStore, acceptHMRUpdate } from 'pinia';

export const useNotificationsStore = defineStore('notifications', () => {
    return {};
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot));
}