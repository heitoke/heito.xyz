<template>
    <div :class="['option', { disabled: option.disabled }]">
        <Icon :name="option.icon" v-if="Boolean(option?.icon)"/>

        <div class="content">
            <div>{{ option?.label || option?.value }}</div>

            <div>{{ option?.text }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>

export interface Option {
    image?: string;
    icon?: string;
    label?: string;
    text?: string;
    value: string;

    disabled?: boolean;
}


const props = defineProps<{
    option: Option;
}>();

</script>

<style lang="scss" scoped>

.option {
    display: flex;
    min-height: 32px;
    padding: 8px 14px;
    align-items: center;
    box-sizing: border-box;
    transition: .2s;
    user-select: none;

    &:not(.disabled, .selected):hover {
        cursor: pointer;
        background-color: var(--background-secondary);
    }

    &.selected {
        cursor: pointer;
        background-color: var(--color-primary);
        // opacity: .5;

        div:nth-child(1) {
            color: var(--white);
            text-decoration: underline;
        }
    }

    &.disabled {
        cursor: not-allowed;
        background-color: var(--background-secondary);
        opacity: .5;
    }

    .ui-icon {
        margin-right: 8px;
    }

    .content {
        max-width: 100%;
        min-width: 0;
        flex: 1;

        div {
            max-width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        
        div:nth-child(1) {
            font-size: 12px;
        }

        div:nth-child(2) {
            font-size: 10px;
        }
    }
}

</style>