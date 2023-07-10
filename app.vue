<template>
    <ClientOnly>
        <Toolpics/>
        <ContextMenu/>
        <Notifications/>
        <Windows/>
        <Header @changeSuperMode="superMode = $event"/>
    </ClientOnly>

    <NuxtLayout :name="layoutName" :active="superMode">
        <ScrollBar v-slot="scrollProps" style="width: 100%">
            <NuxtPage :scrollProps="scrollProps"
                :class="['page', { 'to-left': $notifications.getActive }]"
            />

            <!-- <ClientOnly>
                <div class="go-top" v-show="scrollProps.scroll.top > ($win.size?.width / 2)"
                    @click="goTop(scrollProps)"
                >
                    <Icon name="arrow-up"/>
                </div>
    
                <Footer v-if="!($route.meta.hide as any)?.includes('footer')"/>
            </ClientOnly> -->
        </ScrollBar>
    </NuxtLayout>
</template>

<script lang="ts" setup>

import Header from '~/components/header/Main.vue';
import Notifications from '~/components/notifications/Main.vue';
import Windows from '~/components/Windows.vue';
import Toolpics from '~/components/Toolpics.vue';
import ContextMenu from '~/components/ContextMenu.vue';

import Footer from '~/components/Footer.vue';

import ScrollBar, { type IScrollBar } from '~/components/content/ScrollBar.vue';

import { type IUser, EPermissions } from '~/types/api/user';
import type { IConfigDefault } from '~/types/api/config';

import type { IMessage } from '~/windows/Message.vue';

const { $local, $api, $win, $router } = useNuxtApp();

const route = useRoute();

const
    $user = useUserStore(),
    $notifications = useNotificationsStore(),
    $windows = useWindowsStore(),
    $config = useConfigStore();

const
    layoutName = ref<string>('super-vertical'),
    superMode = ref<boolean>(false),
    blocked = ref<boolean>(false),
    loading = ref<boolean>(true);

function initCustomization() {
    const
        html = document.querySelector('html')!,
        style = document.documentElement.style,
        theme = $local.get('theme'),
        color = $local.get('color');
    
    
    // * Theme
    if (!theme) $local.set('theme', 'dark');
    
    html.setAttribute('theme', $local.get('theme') as string || 'dark');
    
    
    // * Color
    if (color) {
        style.setProperty('--main-color', color as string);
        style.setProperty('--main-color-alt', colors.addAlpha(color as string, .35));
    } else {
        $local.set('color', '#FFBF34');
    }
    
    
    // * Effects
    html?.classList[$local.params?.effect === 'transparent' ? 'add' : 'remove']('no-blur');
        
    style.setProperty('--blur', `${$local.params?.blur || 5}px`);
    style.setProperty('--transparent', colors.addAlpha('#010101', $local.params?.transparent as number));
}

function loadConfig(config: IConfigDefault) {
    const
        hidePages = config.pages?.filter(p => !p.enabled),
        page = hidePages.find(p => p.name === route.name || $router.currentRoute.value.matched.find(r => r.name === p.name)),
        isAdmin = $user.getUser?.permissions?.includes(EPermissions.Site),
        user = page?.users.find(u => u.user._id === $user.getUser?._id);

    if (!isAdmin && !user?.allowed) {
        blocked.value = Boolean(page);
    } else blocked.value = false;

    loading.value = false;
}

async function initConfig() {
    const [config, status] = await $api.configs.default();
    
    if (status !== 200) return $notifications.error({
        message: 'Failed to load configuration',
        status
    });

    $config.set(config);

    loadConfig(config);
}

async function initUser() {
    const [user, status, props] = await $api.users.me();

    if (status !== 200) return $notifications.error({ message: 'Failed to load the user.' });

    function setTokens(props: any) {
        if (props?.token?.refresh) cookies.set('HX_RT', props?.token?.refresh, { days: 365 });
        if (props?.token?.access) cookies.set('HX_AT', props?.token?.access, { days: 7 });
        if (props?.token?.guast) cookies.set('HX_GUAST', props?.token?.guast, { days: 365 });
    }
    
    if (props?.confirmation?.userId) {
        let password = '';

        $windows.create({
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
                            const [user, status] = await $api.auth.login({ login: props?.confirmation?.userId, password });

                            if (status !== 200) return $notifications.error({
                                status,
                                message: user?.message
                            });
                            
                            $windows.close(windowId);
                        }
                    },
                    {
                        label: 'Leave it as it is',
                        color: 'var(--red)',
                        click: async (e: MouseEvent, data: any, windowId: number) => {
                            const [user, status, props] = await $api.users.me('none');

                            if (status !== 200) return $notifications.push({ message: 'Failed to load the user.' });

                            setTokens(props);

                            cookies.delete(['HX_RT', 'HX_AT']);

                            $user.set(user);

                            $windows.close(windowId);
                        }
                    }
                ]
            } as IMessage
        });
        return;
    }

    setTokens(props);

    if (props?.merge) {
        $windows.create({
            component: 'UserMerge',
            close: false,
            data: props.merge
        });
    }

    if (user?._id) $user.set(user);

    initConfig();
}

function goTop(scrollProps: IScrollBar) {
    scrollProps.toScroll(0, scrollProps.scroll.top + 50);

    setTimeout(() => scrollProps.toScroll(0, 0), 500);
}


// * Meta
useHead({
    titleTemplate: (title) => {
        return (title ? `${title} | ` : '') + 'heito.xyz';
    },
    meta: [
        { name: 'twitter:site', content: '@heito.xyz' },
        { name: 'og:site_name', content: 'heito.xyz' },
        { name: 'og:type', content: 'website' }
    ]
});



onMounted(async () => {
    initCustomization();

    initUser();

    $win.init();
});


</script>

<style lang="scss">

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