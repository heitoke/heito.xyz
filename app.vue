<template>
    <NuxtLayout class="layout">
        <NuxtPage class="page"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>

const
    route = useRoute(),
    request = useRequestURL();


// * Meta
useHead({
    titleTemplate: (title) => {
        return (title ? `${title} - ` : '') + 'heito.xyz';
    },
    meta: [
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: request.origin + route.fullPath },
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