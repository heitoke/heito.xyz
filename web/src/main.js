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
    connection: SocketIO('http://localhost:4044'),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    // options: {
    //     path: "/my-app/"
    // }
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
            if (`${ num }`.split('').reverse()[ 1 ] === '1') return five;
            if (`${ num }`.split('').reverse()[ 0 ] === '1') return one;
            if (+(`${ num }`.split('').reverse()[ 0 ]) >= 2 && +(`${ num }`.split('').reverse()[ 0 ]) <= 4) return two;
            return five;
        }
    }
}).use(socket).use(store).use(router).mount('#app')
