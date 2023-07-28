import { defineStore, acceptHMRUpdate } from 'pinia';

import type { IWindow, IButton, IWindowInfo } from 'types/stores/windows';

export const useWindowsStore = defineStore('windows', {
    state: () => ({
        list: [] as Array<IWindow>
    }),
    actions: {
        getWindowIndex(windowId: number): number {
            return this.list.findIndex(window => window.id === windowId);
        },

        create(window: IWindow) {
            const data: IWindow = reactive({
                position: 'center',
                close: {
                    enable: true,
                    button: true
                },
                buttons: [],
                ...window,
                id: this.list.length + 1,
                createdAt: Date.now()
            });

            this.list.push(data);
    
            return { windowId: data.id! }
        },
        close(windowId: number) {
            const windowIndex = this.getWindowIndex(windowId);
    
            if (windowIndex < 0) return;
    
            this.list.splice(windowIndex, 1);
        },

        setInfo(windowId: number, info: IWindowInfo) {
            const windowIndex = this.getWindowIndex(windowId);
    
            if (windowIndex < 0) return;
    
            this.list[windowIndex].info = info;
        },

        hide(windowId: number) {
            const windowIndex = this.getWindowIndex(windowId);
    
            if (windowIndex < 0) return;
    
            this.list[windowIndex].hide = true;
        },
        update(windowId: number, newWindow: IWindow) {
            const windowIndex = this.getWindowIndex(windowId);
    
            if (windowIndex < 0) return;
    
            this.list[windowIndex] = reactive({ ...this.list[windowIndex], ...newWindow });
        },

        setButtons(windowId: number, buttons: Array<IButton>) {
            const windowIndex = this.getWindowIndex(windowId);
    
            if (windowIndex < 0) return;

            this.list[windowIndex].buttons = buttons;
        },
        addButtons(windowId: number, buttons: Array<IButton>) {
            const windowIndex = this.getWindowIndex(windowId);
    
            if (windowIndex < 0) return;
    
            for (const button of buttons) {
                this.list[windowIndex].buttons?.push(button);
            }
        },
        removeButtons(windowId: number, ids: Array<number> | number) {
            const windowIndex = this.getWindowIndex(windowId);
    
            if (windowIndex < 0 && (!ids || (ids as Array<number>).length < 1)) return;
    
            if (!Array.isArray(ids)) ids = [ids];
            
            for (const id of ids.sort((a, b) => a > b ? 1 : -1).reverse()) {
                this.list[windowIndex].buttons?.splice(id, 1);
            }
        }
    },
    getters: {
        getList(state): Array<IWindow> {
            return state.list;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWindowsStore, import.meta.hot));
}