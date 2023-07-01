<template>
    <div class="carousel-tab">
        <div class="content">
            <div class="grid"
                :style="{
                    transform: `translateX(calc(-${index * 100}% - ${index * gap}px))`,
                }"
            >
                <div v-for="(_, idx) in new Array(barLength).fill(0)" :key="idx"
                    :style="{
                        margin: `0 ${gap}px 0 0`,
                        'grid-template-columns': `repeat(${column}, minmax(calc((100% / ${column}) - ${gap}px), 1fr))`,
                        'column-gap': `${gap}px`
                    }"
                >
                    <component v-for="c of ($slots as any)?.default()[0]?.children?.slice(idx * column, idx * column + column)" :key="c" :is="c"></component>
                </div>
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

import { defineComponent, Slot } from 'vue';

export default defineComponent({
    name: 'CarouselTab',
    computed: {
        barLength(): number {
            let n = (this.countElements / this.column);
            return Number.isInteger(n) ? n : Math.floor(n + 1);
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
    data: () => ({
        countElements: 0,
        index: 0
    }),
    methods: {},
    mounted() {
        this.countElements = (this.$slots as any)?.default()[0]?.children?.length as number;
    }
});

</script>

<style lang="scss" scoped>

.carousel-tab {
    .content {
        overflow: hidden;

        .grid {
            display: flex;
            position: relative;
            scroll-behavior: smooth;
            scroll-snap-type: x mandatory;
            transition: .2s;
        
            div {
                display: grid;
                max-width: 100%;
                width: 100%;
                flex-shrink: 0;
                scroll-snap-align: center;
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
                    background-color: var(--main-color);
                }
            }
        }
    }
}

</style>