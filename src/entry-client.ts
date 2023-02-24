import { createApp } from './main';

import './assets/css/root.css';

createApp().then(({ app, router }) => {
    router.isReady().then(() => {
        
        app.mount("#app");
    });
});