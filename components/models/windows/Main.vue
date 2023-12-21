<template>
    <div class="windows">
        <TransitionGroup name="window">
            <Window v-for="window of $windows.list" :key="window.id"
                :window="window"
            />
        </TransitionGroup>
    </div>
</template>

<script lang="ts" setup>

import Window from './Window.vue';


const $windows = useWindowsStore();

</script>

<style lang="scss" scoped>

.windows {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 105;

    .window {
        &-enter-active,
        &-leave-active {
            opacity: 0;
    
            :deep(main) {
                transform: scale(.65);
                transition: .2s !important;
            }
        }
    }
}

</style>