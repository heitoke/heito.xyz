import { defineStore, acceptHMRUpdate } from 'pinia';

import type { Window, WindowOptions, WindowTemplate } from '~/types/stores/windows';

export const useWindowsStore = defineStore('windows', () => {
    const _list = ref<Array<WindowTemplate>>([]);


    // * Functions
    const getWindowIndex = (windowId: number) => {
        return _list.value.findIndex(window => window.id === windowId);
    }

    function create<T extends string>(componentName: T, data?: Window<T>, options?: WindowOptions): WindowTemplate {
        const defaultOptions: WindowOptions = {
            position: ['center'],
            hide: false,
            buttons: [],
            ...options
        }

        const newWindow = {
            id: _list.value.length + 1,
            component: componentName,
            ...defaultOptions,
            data,
            createdAt: Date.now()
        }

        _list.value.push(newWindow);

        return newWindow;
    }

    function close(windowId: number) {
        const windowIndex = getWindowIndex(windowId);

        if (windowIndex < 0) return;

        _list.value.splice(windowIndex, 1);
    }

    function hide(windowId: number) {
        const windowIndex = getWindowIndex(windowId);

        if (windowIndex < 0) return;

        _list.value[windowIndex].hide = true;
    }


    // * Getters
    const list = computed(() => {
        return _list.value;
    });


    return {
        list,

        create,
        close,
        hide
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWindowsStore, import.meta.hot));
}