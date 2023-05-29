<template>
    <button :class="['ui-button', type, { runline }]"
        :style="{
            '--button-color': color
        }"
    >
        <div class="content">
            <slot></slot>
        </div>
    </button>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'UIButton',
    computed: {},
    props: {
        type: {
            type: String as PropType<'default' | 'border'>,
            default: 'border'
        },
        color: {
            type: String,
            default: 'var(--main-color)'
        },
        runline: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({}),
    watch: {},
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

.ui-button {
    cursor: pointer;
    padding: 8px 16px;
    width: 100%;
    position: relative;
    border-radius: 5px;
    box-sizing: border-box;
    transition: .2s;
    user-select: none;
    outline: none;

    .content {
        transition: .2s;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: .5;
    }
}

.ui-button.default {
    padding: 8px 16px;
    border: 1px solid var(--background-secondary);
    background-color: var(--background-secondary);
    overflow: hidden;

    &::after {
        content: " ";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: var(--button-color);
        transition: .2s;
        z-index: 1;
    }

    &:not(:disabled):hover {
        &::after {
            top: 0;
        }
    }

    &:not(:disabled):active {
        transform: scale(.95);
    }

    .content {
        position: relative;
        color: #fff;
        mix-blend-mode:difference;
        z-index: 2;
    }
}

.ui-button.border {
    border: 1px solid var(--button-color);
    background-color: var(--T);
    transition: all .2s, transform 0s;

    &::after {
        content: " ";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 7px;
        border: 0 solid var(--button-color);
        transform: translate(-50%, -50%);
        transition: all .1s;
        opacity: .5;
        z-index: -1;
    }

    .content {
        color: var(--text-secondary);
        overflow: hidden;
    }

    &:not(:disabled):hover {
        // background-color: var(--background-secondary);

        &::after {
            border-width: 4px;
        }

        .content {
            color: var(--text-primary);
        }
    }

    &:not(:disabled):active {
        transform: scale(.95);
    }

    &:disabled {
        border-color: var(--background-secondary-alt);
    }
}

</style>