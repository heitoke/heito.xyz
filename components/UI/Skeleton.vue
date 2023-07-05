<template>
    <div class="ui-skeleton" v-if="!show"></div>
    <slot v-else/>
</template>

<script lang="ts" setup>

const props = defineProps({
    show: { type: Boolean, default: false }
});

</script>

<style lang="scss" scoped>

.ui-skeleton {
    min-width: 16px;
    min-height: 16px;
    border-radius: 5px;
    background-color: var(--background-secondary);
    background: linear-gradient(100deg, rgba(255, 255, 255, 0) 40%, var(--background-secondary-alt) 50%, rgba(255, 255, 255, 0) 60%) var(--background-secondary);
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: 1.5s Loading ease-in-out infinite;

    @keyframes Loading {
        to {
            background-position-x: -20%;
        }
    }
}

</style>