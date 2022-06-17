import { createStore } from 'vuex'

// * Modules
import Super from './modules/super.js';
import menu from './modules/menu.js';
import ls from './modules/ls.js';
import user from './modules/user.js';
import contextMenu from './modules/contextMenu.js';
import theme from './modules/theme.js';
import content from './modules/content.js';
import toolpic from './modules/toolpic.js';

export default createStore({
    state: {},
    mutations: {},
    actions: {},
    getters: {},
    modules: { Super, menu, ls, user, contextMenu, theme, content, toolpic }
})