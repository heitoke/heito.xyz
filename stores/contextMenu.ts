import { defineStore, acceptHMRUpdate } from 'pinia';

import type { ContextMenu } from '~/types/stores/contextMenu';

export const useContextMenuStore = defineStore('context-menu', () => {
    const
        _menu = ref<ContextMenu | null>(),
        _count = ref<number>(0);

    // * Functions
    function create(contextMenu: ContextMenu) {
        if (process.server) return;

        const event = contextMenu.event || window.event;

        if (contextMenu.name === _menu.value?.name) _count.value++;
        else _count.value = 0;

        _menu.value = {
            position: ['fixed', 'bottom', 'center'],
            ...contextMenu,
            event
        };
    }

    function close() {
        _menu.value = null;
        _count.value = 0;
    }


    // * Getters
    const menu = computed(() => _menu.value);

    const count = computed(() => _count.value)

    return {
        menu,
        count,

        create,
        close
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useContextMenuStore, import.meta.hot));
}