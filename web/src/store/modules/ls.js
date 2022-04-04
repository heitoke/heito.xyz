const getLocal = () => {
    let obj = {}
    for (let key in localStorage) {
        try {
            obj[key] = JSON.parse(localStorage[key]);
        } catch (err) {
            obj[key] = localStorage[key];
        }
    }
    return obj;
}

export default {
    state: {
        data: getLocal()
    },
    mutations: {
        'ls:set': (state, { key, value }) => {
            return state.data[key] = value;
        }
    },
    actions: {
        setLocal({ commit }, [key, value]) {
            localStorage.setItem(key, JSON.stringify(value));
            return commit('ls:set', { key, value });
        }
    },
    getters: {
        getLocal(state) {
            return state.data;
        }
    },
}