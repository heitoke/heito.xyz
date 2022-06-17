export default {
    state: {
        text: '',
        type: '',
        x: 0,
        y: 0,
        isActive: false
    },
    mutations: {
        'toolpic:set': (state, { text, type, options }) => {
            let event = window.event;
            state.text = text;
            state.isActive = true;
            state.type = type;
            event.target.addEventListener(options?.closeEvent || 'mouseleave', () => {
                state.isActive = false;
                state.show = false;
            }, { once: true });
        },
        'toolpic:close': (state) => {
            state.isActive = false;
            state.event = null;
        }
    },
    actions: {
        setToolpic({ commit }, [text, type = 'top', options = {}]) {
            return commit('toolpic:set', { text, type, options });
        },
        closeToolpic({ commit }) {
            return commit('toolpic:close');
        }
    },
    getters: {
        getToolpic(state) {
            return state;
        }
    }
}