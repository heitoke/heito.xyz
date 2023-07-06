<template>
    <ClientOnly>
        <!-- <Toolpics/> -->
        <!-- <ContextMenu/> -->
        <Notifications/>
        <!-- <Windows/> -->
        <Header/>
    </ClientOnly>

    <NuxtLayout>
        <ScrollBar v-slot="scrollProps" style="width: 100%">
            <NuxtPage :scrollProps="scrollProps"
                :class="['page', { 'to-left': notifications.getActive }]"
            />

            <div class="go-top" v-show="scrollProps.scroll.top > (winSize[0] / 2)"
                @click="goTop(scrollProps)"
            >
                <Icon name="arrow-up"/>
            </div>
        </ScrollBar>
    </NuxtLayout>
</template>

<script lang="ts" setup>

import Header from '~/components/header/Main.vue';
import Notifications from '~/components/notifications/Main.vue';

import ScrollBar, { type IScrollBar } from '~/components/content/ScrollBar.vue';

const { $local, $api } = useNuxtApp();

const notifications = useNotificationsStore();

const winSize = computed(() => {
    if (process.server) return [0, 0];

    return [window?.innerWidth || 0, window?.innerHeight || 0];
});

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

// async function initUser() {}

// async function initConfig() {}


function goTop(scrollProps: IScrollBar) {
    scrollProps.toScroll(0, scrollProps.scroll.top + 50);

    setTimeout(() => scrollProps.toScroll(0, 0), 500);
}


// * Meta
useHead({
    titleTemplate: (title) => {
        return (title ? `${title} | ` : '') + 'heito.xyz';
    }
})


onMounted(async () => {
    // const user = useUserStore();

    initCustomization();
});


</script>

<style lang="scss" scoped>


</style>