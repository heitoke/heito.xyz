import { defineStore, acceptHMRUpdate } from 'pinia';

import type { Window, WindowOptions, WindowTemplate } from '~/types/stores/windows';

export const useWindowsStore = defineStore('windows', () => {
    const _windows = ref<Array<WindowTemplate>>([]);


    // * Functions
    const getWindowIndex = (windowId: number) => {
        return _windows.value.findIndex(window => window.id === windowId);
    }

    function create<T extends string>(componentName: T, data?: Window<T>, options?: WindowOptions): WindowTemplate {
        const defaultOptions: WindowOptions = {
            position: ['center'],
            hide: false,
            buttons: [],
            ...options
        }

        const newWindow = {
            id: _windows.value.length + 1,
            component: componentName,
            ...defaultOptions,
            data,
            createdAt: Date.now()
        }

        _windows.value.push(newWindow);

        return newWindow;
    }

    function close(windowId: number) {
        const windowIndex = getWindowIndex(windowId);

        if (windowIndex < 0) return;

        _windows.value.splice(windowIndex, 1);
    }

    function hide(windowId: number) {
        const windowIndex = getWindowIndex(windowId);

        if (windowIndex < 0) return;

        _windows.value[windowIndex].hide = true;
    }


    // * Getters
    const windows = computed(() => {
        return _windows.value;
    });


    return {
        windows,

        create,
        close,
        hide
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWindowsStore, import.meta.hot));
}