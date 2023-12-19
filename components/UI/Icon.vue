<template>
    <i :class="['ui-icon hx-icon', `i-${name}`]"></i>
</template>

<script lang="ts" setup>

const props = withDefaults(defineProps<{
    name: string;
}>(), {
    name: 'pacman'
});

</script>

<style lang="scss" scoped>

i.ui-icon {
    color: var(--text-primary);
    transition: .2s;
}

</style>