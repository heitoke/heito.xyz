import { createStore } from 'vuex';

// * Modules
import langs from './modules/langs';
import scrollBar from './modules/scrollBar';
import toolpics from './modules/toolpics';
import windows from './modules/windows';
import contextMenu from './modules/contextMenu';
import header from './modules/header';
import user from './modules/user';
import broadcast from './modules/broadcastChannel';

let modules: any = {
    langs,
    scrollBar,
    toolpics,
    windows,
    contextMenu,
    header,
    user,
    broadcast
}

const store = createStore({
    modules
});

export default store;