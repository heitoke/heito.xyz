<template>
    <div class="carousel-tab">
        <div class="content">
            <div :style="{
                transform: `translateX(calc(-${index * 100}% - ${index * gap}px))`,
                'grid-template': `1fr / repeat(${countElements}, calc(${100 / column}% - ${gap / 2}px))`,
                'column-gap': `${gap}px`
            }">
                <slot style="--g: 123px;"></slot>
            </div>
        </div>
        <div class="bar">
            <div v-for="(_, id) of new Array(barLength)" :key="id"
                :class="['btn', { active: id === index }]"
                @click="index = id"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CarouselTab',
    computed: {
        barLength(): number {
            let n = (this.countElements / this.column);
            return n > Math.floor(n) ? n + .5 : n;
        }
    },
    props: {
        column: {
            type: Number,
            default: 1
        },
        gap: {
            type: Number,
            default: 12
        }
    },
    data() {
        return {
            countElements: 0,
            index: 0
        }
    },
    methods: {},
    mounted() {
        this.countElements = this.$slots?.default()[0]?.children?.length;
    }
});

</script>

<style lang="scss" scoped>

.carousel-tab {
    .content {
        overflow: hidden;

        div {
            display: grid;
            grid-auto-flow: column;
            transition: .2s;

            * {
                margin: 0 16px 0 0;
                scroll-snap-align: center;
                max-width: var(--w) !important;
            
                &:last-child {
                    margin: 0;
                }
            }
        }
    }

    .bar {
        display: flex;
        margin: 8px 0 0 0;
        position: relative;
        align-items: center;
        
        .btn {
            cursor: pointer;
            display: flex;
            margin: 0 12px 0 0;
            padding: 8px 0;
            width: 100%;
            position: relative;
            align-items: center;

            &:last-child {
                margin: 0;
            }

            &:hover {
                &::after {
                    background-color: var(--text-primary);
                }
            }

            &::after {
                content: " ";
                width: 100%;
                height: 2px;
                border-radius: 5px;
                background-color: var(--text-secondary);
                transition: .2s;
            }

            &.active {
                &::after {
                    background-color: var(--C1);
                }
            }
        }
    }
}

</style>