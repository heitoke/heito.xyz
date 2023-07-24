import { defineStore, acceptHMRUpdate } from 'pinia';

import type { IContextMenu } from 'types/stores/contextMenu';

export const useContextMenuStore = defineStore('context-menu', {
    state: () => ({
        contextMenu: {} as IContextMenu,
        count: 0
    }),
    actions: {
        create(contextMenu: IContextMenu) {
            if (process.server) return;

            const event = contextMenu.event || window.event;

            if (contextMenu.name === this.contextMenu.name) this.count++;
            else this.count = 0;
            
            this.contextMenu = {
                position: ['fixed', 'bottom', 'center'],
                gap: [8, 8],
                ...contextMenu,
                event
            };
        },
        close() {
            this.contextMenu = {} as IContextMenu;

            this.count = 0;
        }
    },
    getters: {
        getMenu(state): IContextMenu {
            return state.contextMenu;
        },
        getCount(state): number {
            return state.count;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useContextMenuStore, import.meta.hot));
}