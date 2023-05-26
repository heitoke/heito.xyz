<template>
    <div :class="['ui-loading', type]">
        <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
        <Text :text="value" v-if="type !== 'circle'"/>
    </div>
</template>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

export default defineComponent({
    name: 'UILoading',
    computed: {},
    props: {
        size: {
            type: String,
            default: '48px'
        },
        type: {
            type: String as PropType<'default' | 'circle'>,
            default: () => 'default'
        }
    },
    data: () => ({
        value: '',
        titles: [
            'In search of something...',
            'Uploading something new :D',
            '5.. 10. 16... 21. 40.. wait a minute',
            'Something new'
        ],
        inv: null
    }),
    watch: {},
    methods: {
        setValue() {
            this.value = this.titles[Math.floor(Math.random() * this.titles.length)];
        }
    },
    mounted() {
        this.setValue();

        this.inv = setInterval(() => this.setValue(), 5000) as any;
    },
    unmounted() {
        clearInterval(this.inv as any);
    }
});

</script>

<style lang="scss" scoped>

$offset: 187;
$duration: 1.4s;

.ui-loading {
    &.default {
        display: flex;
        padding: 24px;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--background-primary-alt);

        .spinner {
            margin: 0 16px 0 0;
        }
    }

    @keyframes Rotator {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(270deg);
        }
    }
    
    @keyframes Colors {
        0% { stroke: var(--main-color); }
        25% { stroke: var(--background-secondary); }
        50% { stroke: var(--main-color-alt); }
        75% { stroke: var(--background-secondary); }
        100% { stroke: var(--main-color); }
    }

    @keyframes Dash {
        0% {
            stroke-dashoffset: $offset;
        }
        50% {
            stroke-dashoffset: calc($offset / 4);
            transform: rotate(135deg);
        }
        100% {
            stroke-dashoffset: $offset;
            transform: rotate(450deg);
        }
    }

    .spinner {
        width: 32px;
        height: 32px;
        animation: Rotator $duration linear infinite;
    }

    .path {
        stroke-dasharray: $offset;
        stroke-dashoffset: 0;
        transform-origin: center;
        animation: Dash $duration ease-in-out infinite, Colors ($duration * 4) ease-in-out infinite;
    }
}

</style>