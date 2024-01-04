<template>
    <ul class="buttons">
        <li v-for="btn of buttons" :key="btn.icon"
            :style="{ '--button-color': btn?.color || 'var(--text-primary)' }"

            @click="btn?.click && btn.click($event)"
            @mouseenter="$toolpic.show(btn?.label || 'Click me?', { position: ['left'] })"
        >
            <Icon :name="btn.icon"/>
        </li>
    </ul>
</template>

<script lang="ts" setup>

import type { Button } from '~/types/stores/windows';


const $toolpic = useToolpicStore();


const props = defineProps<{
    buttons: Array<Button>;
}>();

</script>

<style lang="scss" scoped>

ul {
    display: flex;
    flex-direction: column;
    transition: all .2s;
    z-index: 3;

    li {
        cursor: pointer;
        display: flex;
        min-width: 24px;
        min-height: 24px;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
        transition: .2s;
        
        &:not(:last-child) {
            margin-bottom: 8px;
        }

        &:hover {
            .ui-icon {
                color: var(--button-color);
            }
        }

        .ui-icon {
            color: var(--text-secondary);
            font-size: 12px;
        }
    }
}

</style>