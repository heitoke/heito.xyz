export default {
    state: {
        isActive: false,
        edit: false
    },
    mutations: {
        'super:set'(state, boolean) {
            if (state.edit) return;
            state.edit = true;
            setTimeout(() => state.edit = false, 1);
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