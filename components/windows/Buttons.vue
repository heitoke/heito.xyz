<template>
    <ul class="buttons">
        <li v-for="btn of buttons" :key="btn.icon"
            @click="btn?.click ? btn?.click($event) : null;"
            @mouseenter="btn?.label ? toolpics.set({ title: btn.label, position: $win.size.width > 540 ? 'left' : 'right' }) : null"
        >
            <Icon :name="btn?.icon"
                :style="{ color: btn?.color || 'var(--text-primary)' }"
            />
        </li>
    </ul>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IButton } from 'types/stores/windows';

const toolpics = useToolpicsStore();


const props = defineProps({
    buttons: {
        type: Object as PropType<Array<IButton>>,
        required: true
    }
});

</script>

<style lang="scss" scoped>

.buttons {
    display: flex;
    position: absolute;
    top: 0;
    left: calc(100% + 12px);
    flex-direction: column;
    transition: all .2s;
    z-index: 3;

    li {
        cursor: pointer;
        display: flex;
        margin: 0 0 8px 0;
        min-width: 32px;
        min-height: 32px;
        border-radius: 5px;
        align-items: center;
        justify-content: center;

        &:last-child {
            margin: 0;
        }

        i {
            color: var(--button-color);
        }
    }
}

</style>