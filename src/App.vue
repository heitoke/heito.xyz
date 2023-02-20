<template>
    <Toolpics/>
    <ContextMenu/>
    <Notifications/>
    <Windows/>
    <Header/>
    <RouterView v-slot="{ Component }">
        <ScrollBar>
            <component :is="Component" :class="['page', { 'to-left': getActiveNotifications }]"></component>
        </ScrollBar>
    </RouterView>
</template>

<script setup lang="ts">

import Header from './components/Header.vue';
import ScrollBar from './components/ScrollBar.vue';
import Notifications from './components/Notifications.vue';
import Toolpics from './components/Toolpics.vue';
import Windows from './components/Windows.vue';
import ContextMenu from './components/ContextMenu.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
    name: 'App',
    components: {},
    computed: {
        ...mapGetters(['getActiveNotifications'])
    },
    props: {},
    data: () => ({}),
    watch: {},
    methods: {
        ...mapActions(['setWinSize', 'setScroll'])
    },
    mounted() {
        this.setWinSize([window.innerWidth, window.innerHeight]);

        window.addEventListener('resize', () => {
            this.setWinSize([window.innerWidth, window.innerHeight]);
        });
    }
});

</script>

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

.page {
    padding-top: 64px !important;
    max-width: 100vw;
    width: 100vw;
    min-width: 100vw;
    // max-height: 100vh;
    height: 100vh;
    // min-height: 100vh;
    position: relative;
    box-sizing: border-box;
    transition: .5s;
    // overflow-x: hidden;

    &.to-left {
        transform: scale(.8) translateX(-20vw);
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
