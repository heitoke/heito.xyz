export default {
    state: {
        login: false,
        user: null
    },
    mutations: {
        'user:setLogin': (state, boolean) => {
            return state.login = boolean;
        },
        'user:setUser': (state, user) => {
            return state.user = user;
        }
    },
    actions: {
        setLogin({ commit }, boolean) {
            return commit('user:setLogin', boolean);
        },
        setUser({ commit }, user) {
            return commit('user:setUser', user);
        }
    },
    getters: {
        getLogin(state) {
            return state.login;
        },
        getUser(state) {
            return state.user;
        }
    }
}