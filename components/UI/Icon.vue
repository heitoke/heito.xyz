<template>
    <i :class="`hx-icon i-${name}`" v-if="type === 'icon'"></i>
    
    <span class="hx-char" v-else-if="type === 'char'">{{ name.slice(0, 1) }}</span>
</template>

<script lang="ts" setup>

import type { PropType } from 'nuxt/dist/app/compat/capi';

const props = defineProps({
    name: { type: String, default: 'pacman' },
    type: {
        type: String as PropType<'icon' | 'char'>,
        default: 'icon'
    }
});

</script>

<style lang="scss" scoped>

i.hx-icon,
span.hx-char {
    color: var(--text-primary);
    font-size: 16px;
    transition: .2s;
}

</style>