import { createStore } from 'vuex'

// * Modules
import theme from './modules/theme.js'
import contacts from './modules/contacts.js'
import connect from './modules/connect.js'
import notifications from './modules/notifications.js'
import paint from './modules/paint.js'

export default createStore({
    state: {
        pages: {
            projects: {
                on: false
            }
        }
    },
    mutations: {},
    actions: {
        close() {
            return window.close()
        }
    },
    modules: { theme, contacts, connect, paint, notifications }
})
