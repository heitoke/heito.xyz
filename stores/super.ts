import { defineStore, acceptHMRUpdate } from 'pinia';

export const useSuperStore = defineStore('super', () => {
    const _active = ref<boolean>(false);

    
    // * Getters
    const isActive = computed(() => _active.value);

    // * Functions
    function set(value: boolean) {
        _active.value = value;
    }


    return {
        isActive,

        set
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSuperStore, import.meta.hot));
}