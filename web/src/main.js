import { createApp } from 'vue'
import { mapActions, mapGetters } from 'vuex';
import App from './App.vue'
import store from './store'
import router from './router'

// * Icons FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas, fab);

// * CSS
import './assets/css/root.css'
import './assets/css/theme.css'
import './assets/css/fonts.css'
import './assets/css/markdown.css'

// * Main Components
import { Components, Fields } from './components'

// * Main Functions
import Functions from './functions'

createApp(App).mixin({
    components: { ...Components, ...Fields },
    computed: {
        ...mapGetters(['isSuper', 'getMenu', 'getLocal', 'getContextMenu', 'getUser', 'getLogin', 'getContent', 'getContentEdited']),
        getDomain: () => location.hostname === 'localhost' ? 'http://localhost:8081' : location.origin,
        getMobile() {
            let agent = navigator.userAgent.toLowerCase();
            return window.innerWidth <= 620 || agent.includes('iphone') || agent.includes('android') || agent.includes('blackberry') || agent.includes('webos');
        },
        getRole() {
            return this.getLocal?.profile && this.getLocal?.token && this.getLogin;
        }
    },
    data() {
        return {
            listRouters: router.options.routes.filter(item => !item?.meta?.hide),
            serviceTypes: {
                spotify: ['fab', 'spotify'],
                telegram: `uil uil-telegram`,
                github: ['fab', 'github'],
                steam: ['fab', 'steam'],
                discord: ['fab', 'discord'],
                osu: 'https://osu.ppy.sh/favicon-32x32.png',
                minecraft: 'https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/apple-icon-180x180.png',
                email: 'uil uil-at',
                genkan: 'https://genkan.xyz/favicon.ico'
            }
        }
    },
    methods: {
        ...mapActions(['setSuper', 'setMenu', 'closeMenu', 'setLocal', 'openContextMenu', 'closeContextMenu', 'setUser', 'setLogin', 'setContent', 'setContentKey', 'setContentEdited']),
        ...Functions,
        generate(length = 32) {
            return new Array(length).fill(`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`).map(x => x[Math.floor(Math.random() * x.length)]).join('');
        },
        getImage(image) {
            if (!image) return false;
            return `${this.getDomain}/images/${image}`
        },
        router(path) {
            if (this.getContextMenu.isActive) return;
            return this.$router.push(path);
        },
        redirect(link, target = true, forced = false) {
            if (this.getContextMenu.isActive && !forced) return;
            return window.open(link, target ? '_blank' : '_self');
        },
        async fetch(uri = '', data = {}, method = 'POST', json = true, headers = { 'Content-Type': 'application/json' }) {
            let res = await fetch(`${this.getDomain}${uri}`, {
                body: method === 'GET' ? undefined : (json ? JSON.stringify(data) : data),
                headers: { ...headers },
                method
            });
            return await res.json();
        },
        async updateContent(content) {
            let data = await this.fetch('/content/update', { token: this.getLocal?.token, data: content });
            if (data?.status === 200) return this.setContentEdited(false);
        }
    }
}).use(router).use(store)
.component('fa', FontAwesomeIcon)
.mount('body');
