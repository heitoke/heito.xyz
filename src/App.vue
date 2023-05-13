<template>
    <Toolpics/>
    <ContextMenu/>
    <Notifications/>
    <Windows/>
    <Header
        @changeSuperMode="superMode = $event"
    />
    <RouterView v-slot="{ Component }">
        <HorizontalSuper v-if="getSuperMode === 'horizontal'"
            :component="Component" :active="superMode"
        />
        <VerticalSuper v-if="getSuperMode === 'vertical'"
            :component="Component" :active="superMode"
        />
        
        <!-- <ScrollBar v-slot="scrollProps">
                <Transition name="page">
                    <component :is="Component" :class="['page', { 'to-left': getActiveNotifications }]"
                        :scrollProps="scrollProps"
                    ></component>
                </Transition>
                <Footer v-if="!($route.meta?.hide as any)?.includes('footer')"/>
            </ScrollBar> -->
    </RouterView>
</template>

<script setup lang="ts">

import Header from './components/Header.vue';
import Notifications from './components/Notifications.vue';
import Toolpics from './components/Toolpics.vue';
import Windows from './components/Windows.vue';
import ContextMenu from './components/ContextMenu.vue';

import HorizontalSuper from './components/super/Horizontal.vue';
import VerticalSuper from './components/super/Vertical.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

import { addAlpha, setCookie, getCookie } from './libs/functions';

import Users from './libs/api/routes/users';

export default defineComponent({
    name: 'App',
    components: {},
    computed: {
        ...mapGetters(['getActiveNotifications']),
        getSuperMode() {
            try {
                if (!process) return this.$local.params?.super || 'vertical';
            } catch (error) {
                return 'vertical';
            }
        }
    },
    props: {},
    data: () => ({
        superMode: false
    }),
    watch: {},
    sockets: {
        'server:cookie'({ name, value, days }) {
            setCookie(name, value, days);
        }
    },
    methods: {
        ...mapActions(['setWinSize', 'setScroll', 'setUser', 'setLang', 'setBroadcastChannel']),
        setEffects() {
            let html = document.querySelector('html'),
                style = document.documentElement.style;

            html?.classList[this.$local.params?.effect === 'transparent' ? 'add' : 'remove']('no-blur');
        
            style.setProperty('--blur', `${this.$local.params?.blur || 5}px`);
            style.setProperty('--transparent', addAlpha('#010101', this.$local.params?.transparent as number));
        },
        initCustomization() {
            let html = document.querySelector('html');

            this.setWinSize([window.innerWidth, window.innerHeight]);

            this.setLang(this.$local.get('lang') || 'en');

            this.setBroadcastChannel();

            if (!this.$local.get('theme')) this.$local.set('theme', 'dark');
            html?.setAttribute('theme', this.$local.get('theme') as any || 'dark');

            let color = this.$local.params?.color;

            if (color) {
                let style = document.documentElement.style;
                style.setProperty('--main-color', color);
                style.setProperty('--main-color-alt', addAlpha(color, .35));
            }

            this.setEffects();
        },
        async initUser() {
            let [user] = await Users.me(true);
            
            if (user?.token?.refresh) setCookie('HX_RT', user?.token?.refresh, 365);
            if (user?.token?.access) setCookie('HX_AT', user?.token?.access, 7);

            delete user['token'];

            if (user?._id) this.setUser(user);
        }
    },
    async mounted() {
        await this.initCustomization();

        await this.initUser();

        window.addEventListener('resize', () => {
            this.setWinSize([window.innerWidth, window.innerHeight]);
        });
    }
});

</script>

<style lang="scss">

.page-enter-active,
.page-leave-active {
    transition: .2s;
    transform: scale(.8) translateY(-25vh);
    opacity: 0;
}

body {
    max-width: 100vw;
    // min-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: all .2s;
    overflow: hidden;
}

.page {
    padding-top: 64px !important;
    max-width: 100%;
    width: 100%;
    min-width: 100%;
    height: 100%;
    min-height: 100%;
    position: relative;
    box-sizing: border-box;
    transition: .5s;

    &.to-left {
        border-radius: 15px;
        transform: scale(.9) translateX(-4vw);
        overflow: hidden;
    }
}

.start-loading {
    &-enter-active,
    &-leave-active {
        opacity: 0;
    }
}


* {
    scrollbar-width: none;
    
    &::-webkit-scrollbar-button {
        background-repeat: no-repeat;
        width: 0px !important;
        height: 0px !important;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        -webkit-border-radius: 0px;
        border-radius: 0px;
        background-color: var(--background-darked);
    }

    &::-webkit-resizer {
        background-repeat: no-repeat;
        width: thin !important;
        height: 0px !important;
    }

    &::-webkit-scrollbar {
        width: 0px !important;
        background: var(--T);
    }
}

</style>
