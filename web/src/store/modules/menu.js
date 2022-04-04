export default {
    state: {
        list: []
    },
    mutations: {
        'menu:add': (state, menu) => {
            return state.list = [ ...state.list, menu ];
        },
        'menu:remove': (state, id) => {
            return state.list = state.list.filter((item, i) => i !== id);
        }
    },
    actions: {
        setMenu({ commit }, [name, data]) {
            return commit('menu:add', { name, data });
        },
        closeMenu({ commit }, id) {
            return commit('menu:remove', id);
        }
    },
    getters: {
        getMenu(state) {
            return state.list;
        }
    },
}