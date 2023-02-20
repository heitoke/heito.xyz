import { createStore, type StoreOptions, Store, Module } from 'vuex';

// * Modules
import langs from './modules/langs';
import scrollBar from './modules/scrollBar';
import notifications from './modules/notifications';
import toolpics from './modules/toolpics';
import windows from './modules/windows';
import contextMenu from './modules/contextMenu';

let modules: any = {
    langs,
    scrollBar,
    notifications,
    toolpics,
    windows,
    contextMenu
}

const store = createStore({
    modules
});

export default store;