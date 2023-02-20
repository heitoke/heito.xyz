import type { StoreOptions } from 'vuex';

interface State {
    x: number;
    y: number;
    winWidth: number;
    winHeight: number;
}

const module: StoreOptions<State> = {
    state: {
        x: 0,
        y: 0,
        winWidth: 0,
        winHeight: 0
    },
    mutations: {
        'scroll:set'(state: State, [x, y]: [x: number, y: number]) {
            state.x = x;
            state.y = y;
        },
        'win:size:set'(state: State, { width, height }: { width: number, height: number }) {
            width ? state.winWidth = width : null;
            height ? state.winHeight = height : null;
        }
    },
    actions: {
        setScroll({ commit }, [x, y]: [x: number, y: number]) {
            commit('scroll:set', [x, y]);
        },
        setWinSize({ commit }, [width, height]: [width: number, height: number]) {
            commit('win:size:set', { width, height });
        }
    },
    getters: {
        getScrollY(state: State): number {
            return state.y;
        },
        getWinWidth(state: State): number {
            return state.winWidth
        },
        getWinHeight(state: State): number {
            return state.winHeight
        }
    }
}

export default module;