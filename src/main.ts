import { createSSRApp, type Component, type ComputedOptions, type MethodOptions } from 'vue';

import App from './App.vue';

import router from './router';
import store from './store';

// * CSS
import './assets/css/root.css';

// * Plugins
import Sockets from './plugins/sockets';
import Storage from './plugins/storage';
import Log from './plugins/log';

export const createApp = async () => {
    const app = createSSRApp(App);

    let components = import.meta.glob('./components/UI/*.vue', { eager: true }),
        windows: any = import.meta.glob('./windows/**/*.vue', { eager: true });

    Object.entries(components).forEach(([path, component]: [string, any]) => {
        const componentName: any = path?.split('/')?.pop()?.replace(/\.\w+$/, '');
        
        app.component(componentName, component.default);
    });

    Object.entries(windows).forEach(([path, component]: [string, any]) => {
        const componentName: any = path?.split('/')?.pop()?.replace(/\.\w+$/, '');
        
        app.component(componentName, component.default);
    });

    app.use(router);
    app.use(store);
    app.use(Sockets, {
        connection: import.meta.env.VITE_API_URL
    });
    app.use(Storage);
    app.use(Log);
    
    return { app, router, store }
}
