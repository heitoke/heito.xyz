import { createStore } from 'vuex'

// * Modules
import Super from './modules/super.js'
import menu from './modules/menu.js'
import ls from './modules/ls.js'
import user from './modules/user.js'
import contextMenu from './modules/contextMenu.js'
import theme from './modules/theme.js'

export default createStore({
    state: {},
    mutations: {},
    actions: {},
    getters: {},
    modules: { Super, menu, ls, user, contextMenu, theme }
})