<template>
    <div class="default">
        <slot/>
    </div>
</template>

<style lang="scss">

.layout.default {
    max-height: calc(100dvh - 64px);
    overflow-x: hidden;
}

</style>