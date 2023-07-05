import { defineStore, acceptHMRUpdate } from 'pinia';

export type TToolpicPosition = 'top' | 'left' | 'bottom' | 'right';

export interface IToolpic {
    id?: number;
    name?: number;
    component?: string;
    title?: string;
    text: string;
    event?: Event;
    position?: TToolpicPosition;
    x?: number;
    y?: number;
}

export const useToolpicsStore = defineStore('toolpics', {
    state: () => ({
        list: [] as Array<IToolpic>
    }),
    actions: {
        set(toolpic: IToolpic) {
            if (this.list.find(t => t.name === toolpic.name) || process.server) return;

            const event: Event = toolpic?.event || window.event!;

            this.list = [...this.list, {
                position: 'top',
                ...toolpic,
                id: this.list.length + 1,
                event
            }];
        },
        close(toolpicId: number) {
            this.list = this.list.filter(toolpic => toolpic.id !== toolpicId);
        }
    },
    getters: {
        getListToolpics(state): IToolpic[] {
            return state.list;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useToolpicsStore, import.meta.hot));
}