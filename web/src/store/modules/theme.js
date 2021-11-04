export default {
    state: {
        type: localStorage.getItem('theme')
    },
    mutations: {
        set(state, type) {
            return state.type = type
        }
    },
    actions: {
        setTheme({ commit }, type) {
            localStorage.setItem('theme', type)
            document.querySelector('html').setAttribute("theme", type);
            document.querySelector("link[rel*='icon']").href = `./images/logo_${type}.png`;
            return commit('set', type)
        }
    },
    getters: {
        getTheme(state) {
            return state.type
        }
    }
}