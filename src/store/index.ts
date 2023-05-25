import { createStore } from 'vuex';

// * Modules
import langs from './modules/langs';
import window from './modules/window';
import toolpics from './modules/toolpics';
import contextMenu from './modules/contextMenu';
import header from './modules/header';
import user from './modules/user';
import broadcast from './modules/broadcastChannel';

let modules: any = {
    langs,
    window,
    toolpics,
    contextMenu,
    header,
    user,
    broadcast
}

const store = createStore({
    modules
});

export default store;