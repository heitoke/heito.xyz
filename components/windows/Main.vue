<template>
    <div class="windows">
        <TransitionGroup name="window">
            <Window v-for="window of windows.getList" :key="window?.id"
                :window="window"
            />
        </TransitionGroup>
    </div>
</template>

<script lang="ts" setup>

import Window from './Window.vue';

const windows = useWindowsStore();

</script>

<style lang="scss" scoped>

.window-enter-active,
.window-leave-active {
    transform: scale(.5);
    opacity: 0;
}

.windows {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 105;
}

</style>