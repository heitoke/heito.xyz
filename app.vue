<template>
    <Header/>
    <Notifications/>
    <Windows/>
    <ContextMenu/>
    <Toolpic/>

    <NuxtLayout class="layout" :name="'super-vertical'">
        <NuxtPage class="page"
            :style="{ padding: $route.meta?.pageOptions?.padding || '0 32px' }"
        />

    </NuxtLayout>
</template>

<script lang="ts" setup>

import Header from '~/components/models/header/Main.vue';
import Notifications from '~/components/models/notifications/Main.vue';
import Windows from '~/components/models/windows/Main.vue';
import ContextMenu from '~/components/models/context-menu/Main.vue';
import Toolpic from '~/components/models/toolpic/Main.vue';


const
    $route = useRoute(),
    $request = useRequestURL();


function init() {
    const html = document.querySelector('html')! as HTMLElement;

    if (!html) return;

    const theme = cookies.get('theme');

    if (theme) {
        html.className = theme;
    }
}


onMounted(() => {
    init();
});


// * Meta
useHead({
    titleTemplate: (title) => {
        return (title ? `${title} - ` : '') + 'heito.xyz';
    },
    meta: [
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: $request.origin + $route.fullPath },
        { name: 'refresh', content: '5' }
    ],
    link: [
        {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.ico'
        }
    ],
    htmlAttrs: {
        class: 'dark',
        lang: 'en'
    }
});

</script>

<style lang="scss">

.layout {
    max-height: calc(100dvh - 64px) !important;
    height: calc(100dvh - 64px) !important;
    min-height: calc(100dvh - 64px) !important;
}

</style>