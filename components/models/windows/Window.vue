<template>
    <div :class="['window', ...window.position]">
        <div class="background" @click="close"></div>

        <main class="blur">
            <component class="block"
                :is="windowComponent(window.component)"
                :windowId="window.id"
                :data="window.data"
                :close="close"
            />

            <Buttons
                :buttons="getWindowButtons"
            />
        </main>
    </div>
</template>

<script lang="ts" setup>

import Buttons from './Buttons.vue';

import type { WindowTemplate } from '~/types/stores/windows';


const $windows = useWindowsStore();


const props = defineProps<{
    window: WindowTemplate;
}>();


const getWindowButtons = computed(() => {
    const { id, buttons } = props.window;

    return [
        {
            label: 'Close window',
            icon: 'close',
            color: 'var(--red)',
            click: () => $windows.close(id)
        },
        ...buttons || []
    ];
});


function windowComponent(name: string) {
    return resolveComponent(name);
}

function close() {
    $windows.close(props.window.id);
}

</script>

<style lang="scss" scoped>

.window {
    display: flex;
    padding: 5vw 5vh;
    width: 100dvw;
    height: 100dvh;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    transition: opacity .5s;
    z-index: 2;

    &.center {
        align-items: center;
        justify-content: center;
    }

    &.top {
        align-items: flex-start;
    }

    &.bottom {
        align-items: flex-end;
    }

    &.left {
        justify-content: flex-start;
    }

    &.right {
        justify-content: flex-end;
    }

    .background {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #00000035;
        z-index: 1;
    }

    main {
        padding: 12px;
        max-height: 90%;
        position: absolute;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        transition: .2s;
        // overflow-x: hidden;
        z-index: 2;

        ul.buttons {
            position: absolute;
            top: 0;
            left: calc(100% + 12px);
        }
    }
}

</style>