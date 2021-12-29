import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-3-socket.io'
import SocketIO from 'socket.io-client'

// * CSS
import './assets/css/root.css'
import './assets/css/theme.css'
import './assets/css/ui-title.css'
import './assets/css/fonts.css'

const socket = new VueSocketIO({
    debug: false,
    connection: SocketIO(location.hostname === 'localhost' ? 'http://localhost:4044' : 'https://heito.xyz'),//SocketIO('https://heito.xyz').connected ? SocketIO('https://heito.xyz') : SocketIO('http://localhost:4044'),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
})

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
        }
    }
}).use(socket).use(store).use(router).mount('#app')
