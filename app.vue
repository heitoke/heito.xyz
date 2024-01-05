<template>
    <Header/>
    <Notifications/>
    <Windows/>
    <ContextMenu/>
    <Toolpic/>

    <NuxtLayout class="layout" :name="'super-vertical'"
        :routes="getListRoutes"

        v-slot="{ scroll }"
    >
        <NuxtPage class="page"
            :style="{ padding: $route.meta?.pageOptions?.padding || '0 32px' }"

            :scroll="scroll"
        />

        <Footer v-if="!$route.meta?.flags?.includes('hide-footer')"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>

import { useI18n } from 'vue-i18n';

import Header from '~/components/models/header/Main.vue';
import Notifications from '~/components/models/notifications/Main.vue';
import Windows from '~/components/models/windows/Main.vue';
import ContextMenu from '~/components/models/context-menu/Main.vue';
import Toolpic from '~/components/models/toolpic/Main.vue';
import Footer from '~/components/models/footer/Main.vue';

import type { RoutePage } from '~/types/page';


const { $router, $langs } = useNuxtApp();

const { tm: $tm } = useI18n();

const
    $route = useRoute(),
    $request = useRequestURL();


const getListRoutes = computed<Array<RoutePage>>(() => {
    const routes = $router.options.routes.filter(({ meta }) => Boolean(meta?.pageOptions?.name));

    return routes
        .sort((a, b) => {
            return (a.meta?.pageOptions?.index || 0) > (b.meta?.pageOptions?.index || 0) ? 1 : 0;
        })
        .map(({ path, meta }) => {
            const { pageOptions } = meta!;

            const { title, description } = $tm(`pages.${pageOptions?.name}`) as { title: string, description?: string };

            return {
                name: pageOptions?.name || '',
                icon: pageOptions?.icon || 'pacman',
                title,
                description,
                path
            }
        });
});


function init() {
    const html = document.querySelector('html')! as HTMLElement;

    if (!html) return;

    const theme = cookies.get('HX_THEME');

    if (theme) {
        html.className = theme;
    }

    const lang = cookies.get('HX_LANG');

    if (lang) {
        $langs.set(lang);
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