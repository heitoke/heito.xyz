export default {
    state: {
        type: localStorage.getItem('theme'),
        color: localStorage.getItem('mainColor') || 'var(--C6)'
    },
    mutations: {
        'theme:set'(state, type) {
            return state.type = type;
        },
        'theme:set:color'(state, color) {
            return state.color = color;
        }
    },
    actions: {
        setColor({ commit }, color = 'var(--C6)') {
            document.querySelector('.main-color')?.remove();
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.className = 'main-color';
            style.innerText = `:root { --main-color: ${color || 'var(--C6)'}; }`;
            document.querySelector('head').appendChild(style);
            return commit('theme:set', color); 
        },
        setTheme({ commit }, type) {
            localStorage.setItem('theme', type);
            document.querySelector('html').setAttribute("theme", type);
            return commit('theme:set', type);
        }
    },
    getters: {
        getTheme(state) {
            return state.type;
        }
    }
}