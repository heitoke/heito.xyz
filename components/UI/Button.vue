<template>
    <button :class="['ui-button']"
        :disabled="disabled"
    >
        <div class="content">
            <Icon :name="icon" v-if="Boolean(icon)"/>

            <div>
                <div>{{ label }}</div>

                <div>{{ text }}</div>
            </div>
        </div>
    </button>
</template>

<script lang="ts" setup>

const props = withDefaults(defineProps<{
    label: string;
    text?: string;
    color?: string;
    icon?: string;
    disabled?: boolean;
}>(), {
    color: 'var(--main-color)',
    disabled: false
});


const getTextColor = computed(() => {
    const
        color = props.color,
        regex = /var\((.*)\)/;

    return colors.altColor(regex.test(color) ? getRootVarValue(color.match(regex)![1]) : color);
});


function getRootVarValue(key: string) {
    if (process.server) return '#ffffff';

    const rootStyles = document.querySelector(':root')!;

    return getComputedStyle(rootStyles).getPropertyValue(key);
}

</script>

<style lang="scss" scoped>

.ui-button {
    cursor: pointer;
    display: flex;
    padding-inline: 0;
    padding-block: 0;
    width: max-content;
    position: relative;
    border-radius: 5px;
    border: none;
    align-items: center;
    background-color: var(--text-primary);
    box-sizing: border-box;
    transition: .2s, transform 0;
    user-select: none;
    outline: none;
    overflow: hidden;

    &:not(:disabled):active {
        transform: scale(.95);
    }

    &:not(:disabled):hover {
        &::after {
            opacity: .8;
        }
    }

    &::after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: v-bind('color');
        transition: .2s;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: .5;
    }

    .content {
        display: flex;
        padding: 8px 12px;
        max-width: 100%;
        min-width: 0;
        align-items: center;
        flex: 1;
        z-index: 2;

        .ui-icon {
            margin-right: 8px;
            color: v-bind('getTextColor');
        }
        
        & > div {
            max-width: 100%;
            min-width: 0;
            flex: 1;

            div {
                max-width: 100%;
                color: v-bind('getTextColor');
                // text-align: left;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;

                &:nth-child(1) {
                    font-size: 14px;
                }

                &:nth-child(2) {
                    font-size: 12px;
                    opacity: .8;
                }
            }
        }
    }
}

</style>