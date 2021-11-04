import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// * CSS
import './assets/css/root.css'
import './assets/css/theme.css'
import './assets/css/ui-title.css'
import './assets/css/fonts.css'

createApp(App).mixin({
    methods: {
        router(path) {
            return this.$router.push(path);
        },
        redirect(link, target = '_blank') {
            return window.open(link, target);
        }
    }
}).use(store).use(router).mount('#app')
