import { defineStore, acceptHMRUpdate } from 'pinia';

import type { IContextMenu } from 'types/stores/contextMenu';

export const useContextMenusStore = defineStore('context-menus', {
    state: () => ({
        list: [] as Array<IContextMenu>
    }),
    actions: {
        create(contextMenu: IContextMenu) {
            if (this.list.find(c => c.name === contextMenu.name) || process.server) return;

            window.addEventListener('contextmenu', e => {
                e.preventDefault();
            }, { once: true });

            const event = contextMenu.event || window.event;
            
            this.list = [...this.list || [], {
                position: ['bottom', 'right'],
                ...contextMenu,
                event
            }];
        },
        close(contextMenuName: string) {
            this.list = this.list.filter((contextMenu: IContextMenu) => contextMenu.name !== contextMenuName);
        }
    },
    getters: {
        getList(state): IContextMenu[] {
            return state.list;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useContextMenusStore, import.meta.hot));
}