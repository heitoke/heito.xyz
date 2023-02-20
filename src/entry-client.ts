import { createApp } from './main';

import './assets/css/root.css';

const { app, router } = await createApp();

router.isReady().then(() => {
    
    app.mount("#app");
});