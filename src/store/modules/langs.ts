import type { StoreOptions } from 'vuex';

// * Langs
import Langs, { type ILang } from '../../libs/langs';

interface State {
    name: string;
}

const module: StoreOptions<State> = {
    state: {
        name: 'en'
    },
    mutations: {
        'lang:set'(state: State, name: string) {
            return state.name = name;
        }
    },
    actions: {
        setLang({ commit }, name: string) {
            return commit('lang:set', name);
        }
    },
    getters: {
        getLang(state: State): ILang {
            // @ts-ignore
            return Langs[state.name].params;
        },
        getLangName(state: State): string {
            return state.name;
        }
    }
}

export default module;