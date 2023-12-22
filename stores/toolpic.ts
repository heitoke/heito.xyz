import { defineStore, acceptHMRUpdate } from 'pinia';

import type { Toolpic } from '~/types/stores/toolpic';

export const useToolpicStore = defineStore('toolpic', () => {
    const
        _toolpic = ref<Toolpic | null>(null),
        _name = ref<string>('');


    // * Getters
    const toolpic = computed(() => _toolpic.value);
    const name = computed(() => _name.value);


    // * Functions
    function show(text: string, options: Omit<Toolpic, 'text'> = {}) {
        if (process.server) return;

        _name.value = String(Math.random());

        _toolpic.value = {
            position: {
                type: 'center',
                flags: ['top']
            },
            ...options,
            text,
            event: options?.event || window?.event
        }
    }

    function close() {
        _toolpic.value = null;
    }


    return {
        toolpic,
        name,

        show,
        close
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useToolpicStore, import.meta.hot));
}