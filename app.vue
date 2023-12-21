<template>
    <Header/>
    <Notifications/>
    <Windows/>

    <NuxtLayout class="layout">
        <NuxtPage class="page"
            :style="{ padding: $route.meta?.pageOptions?.padding || '0 32px' }"
        />

        <ContextMenu/>
    </NuxtLayout>
</template>

<script lang="ts" setup>

import Header from '~/components/models/header/Main.vue';
import Notifications from '~/components/models/notifications/Main.vue';
import Windows from '~/components/models/windows/Main.vue';
import ContextMenu from '~/components/models/context-menu/Main.vue';


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