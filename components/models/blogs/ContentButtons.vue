<template>
    <Height :showed="edit">
        <div class="buttons" :style="`border-color: ${color};`">
            <Button v-for="btn of buttons" :key="btn.label"
                :color="btn?.color"
                @click="btn?.click ? btn?.click() : null"
            >{{ btn?.label }}</Button>
        </div>
    </Height>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

interface IButton {
    label: string;
    color: string;
    click(): void;
}

const props = defineProps({
    buttons: { type: Object as PropType<Array<IButton>> },
    color: { type: String, default: 'var(--main-color-alt)' },
    edit: { type: Boolean, default: false }
});

</script>

<style lang="scss" scoped>

.buttons {
    display: flex;
    margin: 12px 0 0 0;
    padding: 12px 0;
    border-top: 3px dashed var(--background-secondary);

    .ui-button {
        margin: 0 12px 0 0;
        width: max-content;

        &:last-child {
            margin: 0;
        }
    }
}

</style>