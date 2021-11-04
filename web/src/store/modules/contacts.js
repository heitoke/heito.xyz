export default {
    state: {
        cache: [],
        activity: []
    },
    mutations: {
        setContacts(state, cache) {
            return state.cache = cache
        },
        setContactActivity(state, activity) {
            state.activity = activity
        }
    },
    actions: {
        setContacts({ commit }, cache) {
            return commit('setContacts', cache)
        },
        setContactActivity({ commit }, activity) {
            return commit('setContactActivity', activity)
        }
    },
    getters: {
        getContacts(state) {
            return state.cache
        },
        getActivity(state) {
            return state.activity
        }
    }
}