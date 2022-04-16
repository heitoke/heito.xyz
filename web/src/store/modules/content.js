export default {
    state: {
        mainContent: {},
        edited: false
    },
    mutations: {
        'content:set': (state, data) => {
            return state['mainContent'] = data;
        },
        'content:set:key': (state, { key, param }) => {
            state['mainContent'][key] = param;
            return state['edited'] = true;
        },
        'content:edited': (state, bool) => {
            return state['edited'] = bool;
        }
    },
    actions: {
        setContent({ commit }, data) {
            return commit('content:set', data);
        },
        setContentKey({ commit }, [key, param]) {
            return commit('content:set:key', { key, param });
        },
        setContentEdited({ commit }, key) {
            return commit('content:edited', key);
        }
    },
    getters: {
        getContent(state) {
            return state?.mainContent;
        },
        getContentEdited(state) {
            return state['edited'];
        }
    }
}