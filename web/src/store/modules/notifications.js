export default {
    state: {
        list: []
    },
    mutations: {
        add(state, data) {
            let id = Math.floor(Math.random() * (100000 - 1)) + 1; 
            state.list.push({ id, ...data})
            setTimeout(() => {
                state.list = state.list.filter(f => f.id !== id);
            }, 7000)
        }
    },
    actions: {
        addNotification({ commit }, data) {
            return commit('add', data)
        }
    },
    getters: {
        getNotifications(state) {
            return state.list
        }
    }
}