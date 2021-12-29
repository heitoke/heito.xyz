export default {
    state: {
        open: false
    },
    mutations: {
        setPaint(state, bool) {
            return state.open = bool
        }
    },
    actions: {
        setPaint({ commit }, bool) {
            return commit('setPaint', bool)
        }
    },
    getters: {
        isPaint() {
            return localStorage['paint']
        },
        getPaint(state) {
            return state
        }
    }
}