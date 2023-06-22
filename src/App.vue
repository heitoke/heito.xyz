<template>
    <Toolpics/>
    <ContextMenu/>
    <Notifications/>
    <Windows/>
    <Header
        @changeSuperMode="superMode = $event"
    />
    
    <RouterView v-slot="{ Component }" v-if="!loading">
        <component :is="listSupers[getSuperMode!]" :active="superMode">
            <ScrollBar v-slot="scrollProps" style="width: 100%;">
                <Transition :name="!blocked ? 'page' : 'fade'">
                    <component :is="blocked ? Blocked : Component"
                        :class="['page', { 'to-left': $notifications?.options?.active }]"
                        :scrollProps="scrollProps"
                    ></component>
                </Transition>

                <Transition name="go-top">
                    <div class="go-top" v-show="!($route.meta?.hide as any)?.includes('go-top') && scrollProps?.scroll.top! > (getWinHeight / 2)"
                        @click="goTop(scrollProps)" 
                    >
                        <Icon name="arrow-up"/>
                    </div>
                </Transition>

                <Footer v-if="!($route.meta?.hide as any)?.includes('footer')"/>
            </ScrollBar>
        </component>
    </RouterView>
</template>

<script setup lang="ts">

import Header from './components/Header/Main.vue';
import Notifications from './components/Notifications/Main.vue';
import Toolpics from './components/Toolpics.vue';
import Windows from './components/Windows.vue';
import ContextMenu from './components/ContextMenu.vue';
import Footer from './components/Footer.vue';

import HorizontalSuper from './components/super/Horizontal.vue';
import VerticalSuper from './components/super/Vertical.vue';

import ScrollBar, { type IScrollBar } from './components/content/ScrollBar.vue';

import Blocked from './pages/Blocked.vue';

const listSupers = {
    horizontal: HorizontalSuper,
    vertical: VerticalSuper
}

</script>

<script lang="ts">

import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

import { colors, cookies } from './libs/utils';

import Users, { EPermissions } from './libs/api/routes/users';
import Auth from './libs/api/routes/auth';
import Configs, { IConfigDefault } from './libs/api/routes/configs';
import { IMessage } from './windows/Message.vue';

export default defineComponent({
    name: 'App',
    components: {},
    computed: {
        ...mapGetters(['getUser', 'getWinHeight']),
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
        superMode: false,
        blocked: false,
        loading: true
    }),
    watch: {
        '$route.path'(newValue) {
            if (this.blocked && newValue === '/blocked') return;

            this.loading = true;

            this.loadConfig(this.$config);
        }
    },
    sockets: {
        'server:cookie'({ name, value, days }) {
            cookies.set(name, value, days);
        },
        'configs:update'(config: IConfigDefault) {
            this.$config.set(config);

            this.$notifications.push({
                title: 'Update',
                icon: 'settings',
                message: 'A configuration update has occurred',
                color: 'var(--blue)'
            });

            this.loadConfig(config);
        }
    },
    methods: {
        ...mapActions(['setWinSize', 'setScroll', 'setUser', 'setBroadcastChannel']),

        setEffects() {
            const
                html = document.querySelector('html'),
                style = document.documentElement.style;

            html?.classList[this.$local.params?.effect === 'transparent' ? 'add' : 'remove']('no-blur');
        
            style.setProperty('--blur', `${this.$local.params?.blur || 5}px`);
            style.setProperty('--transparent', colors.addAlpha('#010101', this.$local.params?.transparent as number));
        },
        async initConfig() {
            const [config, status] = await Configs.default();
            
            if (status !== 200) return this.$notifications.error({
                message: 'Failed to load configuration',
                status
            });

            this.$config.set(config);

            this.loadConfig(config);
        },
        loadConfig(config: IConfigDefault) {
            const
                hidePages = config.pages?.filter(p => !p.enabled),
                page = hidePages.find(p => p.name === this.$route.name || this.$router.currentRoute.value.matched.find(r => r.name === p.name)),
                isAdmin = this.getUser?.permissions?.includes(EPermissions.Site),
                user = page?.users.find(u => u.user._id === this.getUser?._id);

            if (!isAdmin && !user?.allowed) {
                this.blocked = Boolean(page);
            } else this.blocked = false;

            this.loading = false;
        },
        initCustomization() {
            const html = document.querySelector('html');

            this.setWinSize([window.innerWidth, window.innerHeight]);

            this.$lang.set((this.$local.get('lang') as any) || 'en');

            this.setBroadcastChannel();

            if (!this.$local.get('theme')) this.$local.set('theme', 'dark');
            html?.setAttribute('theme', this.$local.get('theme') as any || 'dark');

            let color = this.$local.params?.color;

            if (color) {
                let style = document.documentElement.style;
                style.setProperty('--main-color', color);
                style.setProperty('--main-color-alt', colors.addAlpha(color, .35));
            }

            this.setEffects();
        },
        async initUser() {
            const [user, status, props] = await Users.me();

            if (status !== 200) return this.$notifications.error({ message: 'Failed to load the user.' });

            function setTokens(props: any) {
                if (props?.token?.refresh) cookies.set('HX_RT', props?.token?.refresh, { days: 365 });
                if (props?.token?.access) cookies.set('HX_AT', props?.token?.access, { days: 7 });
                if (props?.token?.guast) cookies.set('HX_GUAST', props?.token?.guast, { days: 365 });
            }
            
            if (props?.confirmation?.userId) {
                let password = '';

                this.$windows.create({
                    component: 'Message',
                    close: false,
                    data: {
                        title: 'Account confirmation',
                        text: 'Enter the password of the account that was previously authorized. If you don\'t want to log in or don\'t know the password, you can just skip it.',
                        components: [
                            {
                                name: 'password',
                                component: 'Textbox',
                                props: {
                                    label: 'Password',
                                    type: 'password'
                                },
                                events: {
                                    input: (e: MouseEvent) => {
                                        password = (e.target as any)?.value as string;
                                    }
                                }
                            }
                        ],
                        buttons: [
                            {
                                label: 'Confirm',
                                color: 'var(--green)',
                                click: async (e: MouseEvent, data: any, windowId: number) => {
                                    const [user, status] = await Auth.login({ login: props?.confirmation?.userId, password });

                                    if (status !== 200) return this.$notifications.error({
                                        status,
                                        message: user?.message
                                    });
                                    
                                    this.$windows.close(windowId);
                                }
                            },
                            {
                                label: 'Leave it as it is',
                                color: 'var(--red)',
                                click: async (e: MouseEvent, data: any, windowId: number) => {
                                    const [user, status, props] = await Users.me('none');

                                    if (status !== 200) return this.$notifications.push({ message: 'Failed to load the user.' });

                                    setTokens(props);

                                    cookies.delete(['HX_RT', 'HX_AT']);

                                    this.setUser(user);

                                    this.$windows.close(windowId);
                                }
                            }
                        ]
                    } as IMessage
                });
                return;
            }

            setTokens(props);

            if (props?.merge) {
                this.$windows.create({
                    component: 'Merge',
                    close: false,
                    data: props.merge
                });
            }

            if (user?._id) this.setUser(user);

            this.initConfig();
        },

        goTop(scrollProps: IScrollBar) {
            scrollProps.toScroll(0, scrollProps.scroll.top + 50);

            setTimeout(() => scrollProps.toScroll(0, 0), 500);
        }
    },
    async mounted() {
        this.initCustomization();

        this.initUser();

        window.addEventListener('resize', () => {
            this.setWinSize([window.innerWidth, window.innerHeight]);
        });
    }
});

</script>

<style lang="scss" scoped>

.fade-enter-active,
.fade-leave-active {
    transition: .2s;
    opacity: 0;
}

.page {
    padding-top: 64px !important;
    max-width: 100%;
    width: 100%;
    min-width: 100%;
    // height: 100%;
    min-height: 100%;
    position: relative;
    box-sizing: border-box;
    transition: .5s;

    &.to-left {
        border-radius: 15px;
        transform: scale(.9) translateX(-4vw);
        overflow: hidden;
    }

    &-enter-active,
    &-leave-active {
        transition: .2s;
        transform: scale(.8) translateY(-25vh);
        opacity: 0;
    }
}

.go-top {
    cursor: pointer;
    display: flex;
    width: 48px;
    height: 48px;
    position: absolute;
    right: 32px;
    bottom: 32px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    background-color: var(--background-secondary);
    transition: .2s;

    &:hover {
        background-color: var(--background-secondary-alt);
    }

    &:active {
        transform: scale(.85);
    }

    &-enter-active,
    &-leave-active {
        transform: translateY(32px) scale(.6);
        opacity: 0;
    }
}
    

</style>

<style lang="scss">

body {
    max-width: 100vw;
    // min-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: all .2s;
    overflow: hidden;
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
