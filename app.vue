<template>
    <ClientOnly>
        <Toolpics/>
        <ContextMenu/>
        <Notifications/>
        <Windows/>
        <Header @changeSuperMode="superMode = $event"/>

        <Waiting @end="loading = false"/>
    </ClientOnly>

    <NuxtLayout :name="layoutName" :active="superMode" :style="{ opacity: loading ? 0 : 1 }">
        <ScrollBar v-slot="scrollProps" style="width: 100%">
            <NuxtPage
                :class="['page', { 'to-left': $notifications.getActive }]"
                :scrollProps="scrollProps"
                :transition="{ name: 'slide-top', mode: 'out-in' }"
            />

            <ClientOnly>
                <div class="go-top" v-show="scrollProps.scroll.top > ($win.size?.width / 2)"
                    @click="goTop(scrollProps)"
                >
                    <Icon name="arrow-up"/>
                </div>
    
                <Footer v-if="!($route.meta.hide as any)?.includes('footer')"/>
            </ClientOnly>
        </ScrollBar>
    </NuxtLayout>
</template>

<script lang="ts" setup>

import Waiting from '~/components/Waiting.vue';

import Header from '~/components/header/Main.vue';
import Notifications from '~/components/notifications/Main.vue';
import Windows from '~/components/Windows.vue';
import Toolpics from '~/components/Toolpics.vue';
import ContextMenu from '~/components/ContextMenu.vue';

import Footer from '~/components/Footer.vue';

import ScrollBar, { type IScrollBar } from '~/components/content/ScrollBar.vue';

const { $local, $win, $socket, $api, $config } = useNuxtApp();

const
    request = useRequestURL(),
    route = useRoute();

// seo.setPublicURL($config.public.publicURL);

const
    user = useUserStore(),
    $notifications = useNotificationsStore(),
    config = useConfigStore();

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
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: request.origin + route.fullPath },
        { name: 'refresh', content: '5' }
    ]
});





$socket?.on('server:cookie', ({ name, value, days }) => {
    cookies.set(name, value, { days });
});


$socket?.on('connect', async () => {
    config.setStatus('online');

    console.log('Connect');

    if (user.getUser?._id) return;

    const [result, status] = await $api.users.me();

    if (status !== 200) return;

    user.set(result);
});

$socket?.on('disconnect', () => {
    config.setStatus('offline');

    console.log('Disconnect');

    user.set({} as any);
});



onMounted(async () => {
    initCustomization();

    $win.init();
});


</script>

<style lang="scss">

.fade-enter-active,
.fade-leave-active {
    transition: .2s;
    opacity: 0;
}



.slide-top {
    &-enter-active,
    &-leave-active {
        transition: .3s !important;
        transform: scale(.8) translateY(-25vh);
        opacity: 0;
    }
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