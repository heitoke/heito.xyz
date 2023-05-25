import type { StoreOptions } from 'vuex';

interface State {
    winWidth: number;
    winHeight: number;
}

const module: StoreOptions<State> = {
    state: {
        winWidth: 0,
        winHeight: 0
    },
    mutations: {
        'win:size:set'(state: State, { width, height }: { width: number, height: number }) {
            width ? state.winWidth = width : null;
            height ? state.winHeight = height : null;
        }
    },
    actions: {
        setWinSize({ commit }, [width, height]: [width: number, height: number]) {
            commit('win:size:set', { width, height });
        }
    },
    getters: {
        getWinWidth(state: State): number {
            return state.winWidth
        },
        getWinHeight(state: State): number {
            return state.winHeight
        }
    }
}

export default module;