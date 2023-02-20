import { createSSRApp } from 'vue';

import App from './App.vue';

import router from './router';
import store from './store';

// * CSS
import './assets/css/root.css';

export const createApp = async () => {
    const app = createSSRApp(App);

    let components: any = import.meta.glob('./components/UI/*.vue', { eager: true }),
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

    return { app, router, store }
}
