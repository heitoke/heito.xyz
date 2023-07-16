import { defineStore, acceptHMRUpdate } from 'pinia';

import type { IContextMenu } from 'types/stores/contextMenu';

export const useContextMenuStore = defineStore('context-menu', {
    state: () => ({
        contextMenu: {} as IContextMenu
    }),
    actions: {
        create(contextMenu: IContextMenu) {
            if (process.server) return;

            // window.addEventListener('contextmenu', e => {
            //     e.preventDefault();
            // }, { once: true });

            const event = contextMenu.event || window.event;

            this.contextMenu = {
                position: ['bottom', 'center'],
                gap: [8, 8],
                ...contextMenu,
                event
            };
        },
        close() {
            this.contextMenu = {} as IContextMenu;
        }
    },
    getters: {
        getMenu(state): IContextMenu {
            return state.contextMenu;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useContextMenuStore, import.meta.hot));
}