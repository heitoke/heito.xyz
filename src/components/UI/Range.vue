<template>
    <input type="range" class="ui-range" :min="min" :max="max">
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UIRange',
    computed: {},
    props: {
        min: {
            type: Number,
            default: 1
        },
        max: {
            type: Number,
            default: 10
        }
    },
    data: () => ({}),
    watch: {},
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

input {
    cursor: pointer;
    width: 100%;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;

    &:focus {
        outline: none;
    }

    &::-webkit-slider-runnable-track {
        height: 8px;
        border-radius: 25px;
        background-color: var(--background-secondary-alt);
    }
    &::-webkit-slider-thumb {
        margin-top: -4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: var(--main-color);
        appearance: none;
        -webkit-appearance: none;
        accent-color: var(--main-color);
    }
    &:focus::-webkit-slider-thumb {   
        outline: 3px solid var(--main-color-alt);
        outline-offset: 0.125rem; 
    }


    &::-moz-range-track {
        height: 8px;
        border-radius: 25px;
        background-color: var(--background-secondary-alt);
    }
    &::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border: none;
        border-radius: 50%;
        background-color: var(--main-color);
    }
    &::-moz-range-progress {
        margin-top: 0;
        height: 8px;
        border-radius: 25px;
        background: var(--main-color);
    }
    &:focus::-moz-range-thumb {
        outline: 3px solid var(--main-color-alt);
        outline-offset: 0.125rem; 
    }
}

</style>