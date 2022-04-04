export default {
    state: {
        isActive: false
    },
    mutations: {
        'super:set'(state, boolean) {
            return state.isActive = boolean === 'auto' ? !state.isActive : boolean;
        }
    },
    actions: {
        setSuper({ commit }, boolean) {
            return commit('super:set', boolean);
        }
    },
    getters: {
        isSuper(state) {
            return state.isActive;
        }
    }
}