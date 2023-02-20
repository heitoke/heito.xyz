import type { StoreOptions } from 'vuex';

export type TToolpicPosition = 'top' | 'left' | 'bottom' | 'right';

export interface IToolpic {
    id: number;
    name: number;
    component?: string;
    title?: string;
    text?: string;
    event: Event;
    position?: TToolpicPosition;
    x?: number;
    y?: number;
}

interface State {
    list: IToolpic[]
}

const module: StoreOptions<State> = {
    state: {
        list: []
    },
    mutations: {
        'toolpics:create'(state: State, toolpic: IToolpic) {
            if (state.list.find(t => t.name === toolpic.name)) return;

            let event: Event = toolpic?.event || window.event;

            state.list = [...state.list, {
                position: 'top',
                ...toolpic,
                id: state.list.length + 1,
                event
            }];
        },
        'toolpics:close'(state: State, toolpicId: number) {
            state.list = state.list.filter(toolpic => toolpic.id !== toolpicId);
        }
    },
    actions: {
        setToolpic({ commit }, toolpic: IToolpic) {
            commit('toolpics:create', toolpic);
        },
        closeToolpic({ commit }, toolpicId: number) {
            commit('toolpics:close', toolpicId);
        }
    },
    getters: {
        getListToolpics(state: State): IToolpic[] {
            return state.list;
        }
    }
}

export default module;