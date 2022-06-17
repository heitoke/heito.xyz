const getPosition = (event, type, el) => {
    let inc = val => type.includes(val),
        x = event.clientX,
        y = event.clientY;
    
    if (inc('fixed')) {
        let fixed = event.target.getBoundingClientRect();
        x = Math.floor(fixed.x + (fixed.width / 2));
        y = Math.floor(fixed.y + (fixed.height / 2));
    }

    if (!el) return [0, 0];

    if (type.split(' ').find(item => item === 'center')) return [x - (el.clientWidth / 2), y - (el.clientHeight / 2)];

    else if (inc('top')) {
        if (inc('center-x')) return [x - (el.clientWidth / 2), y - el.clientHeight - 16];
        else return [x, y - el.clientHeight];
    } else if (inc('right')) {
        if (inc('center-y')) return [x + 24, y - (el.clientHeight / 2)];
        else if (inc('center-x')) return [x - el.clientWidth, y - 24];
        else return [x, y];
    } else if (inc('left')) {
        if (inc('center-y')) return [x - el.clientWidth - 24, y - (el.clientHeight / 2)];
        else if (inc('center-x')) return [x - (el.clientWidth / 2), y - 24];
        else return [x - el.clientWidth, y];
    } else if (inc('bottom')) {
        if (inc('center-y')) return [x - el.clientWidth - 24, y - (el.clientHeight / 2)];
        else if (inc('center-x')) return [x - (el.clientWidth / 2), y + (el.clientHeight / 2)];
        else return [x, y];
    }
}

export default {
    state: {
        type: '',
        name: '',
        x: 0,
        y: 0,
        event: null,
        isActive: false
    },
    mutations: {
        'contextmenu:open': (state, { name, type }) => {
            let event = window.event;
            if (state.x === event.clientX || state.y === event.clientY) return;
            new Promise(res => {
                state.isActive = true;
                state.name = name;
                res('end');
            }).then(async () => {
                let pos = getPosition(event, type, document.querySelector('.context-menu'));
                state.x = pos[0];
                state.y = pos[1];
                state.type = type;
                state.event = event;
                if (!type.includes('hover')) {
                    setTimeout(() => {
                        window.addEventListener('click', () => {
                            state.isActive = false;
                            state.event = null;
                        }, { once: true });
                    }, 10)
                } else {
                    event.target.addEventListener('mouseleave', () => {
                        state.isActive = false;
                        state.event = null;
                    }, { once: true });
                }
            });
        },
        'contextmenu:close': (state) => {
            state.isActive = false;
            state.event = null;
        }
    },
    actions: {
        setContextMenu({ commit }, [name, type = 'right']) {
            return commit('contextmenu:open', { name, type });
        },
        closeContextMenu({ commit }) {
            return commit('contextmenu:close');
        }
    },
    getters: {
        getContextMenu(state) {
            return state;
        }
    }
}