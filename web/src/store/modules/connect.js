export default {
    state: {
        ws: null
    },
    mutations: {
        setConnectWS(state, ws) {
            return state.ws = ws
        }
    },
    actions: {
        setConnectWS({ commit }, ws) {
            return commit('setConnectWS', ws)
        }
    },
    getters: {
        getWS(state) {
            return state.ws
        }
    }
}