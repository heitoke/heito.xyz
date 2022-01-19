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
        },
        otf(num, one, two, five) {
            num = `${num}`.split('').reverse();
            if (num[1] === '1') return five;
            if (num[0] === '1') return one;
            if (+(num[0]) >= 2 && +(num[0]) <= 4) return two;
            return five;
        },
        async postFetch(path = '', data = {}) {
            let res = await fetch(`${location.hostname === 'localhost' ? 'http://localhost:4044' : 'https://heito.xyz'}${path}`, {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            return await res.json();
        }
    }
}).use(store).use(router).mount('#app')
