<template>
    <i :class="`hx-icon i-${name}`"></i>
</template>

<script lang="ts" setup>

const props = defineProps({
    name: {
        type: String,
        default: 'pacman'
    }
});

</script>

<style lang="scss" scoped>

i.hx-icon {
    color: var(--text-primary);
    font-size: 16px;
    transition: .2s;
}

</style>