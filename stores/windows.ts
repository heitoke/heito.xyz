import { defineStore, acceptHMRUpdate } from 'pinia';

import type { IWindow, IButton } from 'types/stores/windows';

export const useWindowsStore = defineStore('windows', {
    state: () => ({
        list: [] as Array<IWindow>
    }),
    actions: {
        getWindowIndex(windowId: number): number {
            return this.list.findIndex(window => window.id === windowId);
        },

        create(window: IWindow) {
            const data: IWindow = {
                position: 'center',
                close: {
                    enable: true,
                    button: true
                },
                buttons: [],
                ...window,
                id: this.list.length + 1,
                createdAt: Date.now()
            };

            this.list.push(reactive(data));
    
            return { windowId: data.id! }
        },
        close(windowId: number) {
            const windowIndex = this.getWindowIndex(windowId);
    
            if (windowIndex < 0) return;
    
            this.list.splice(windowIndex, 1);
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
        addButtons(windowId: number, buttons: Array<IButton>): void {
            const windowIndex = this.getWindowIndex(windowId);
    
            if (windowIndex < 0) return;
    
            for (const button of buttons) {
                this.list[windowIndex].buttons?.push(button);
            }
        },
        removeButtons(windowId: number, ids: Array<number> | number): void {
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