<template>
    <button class="ui-button"
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
        color: {
            type: String,
            default: 'var(--main-color)'
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
    border: 1px solid var(--background-secondary);
    background-color: var(--background-secondary);
    box-sizing: border-box;
    transition: .2s;
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

    &:disabled {
        cursor: not-allowed;
        opacity: .5;
    }
}

</style>