<template>
    <div class="carousel-tab">
        <div class="content">
            <div :style="{ transform: `translateX(calc(-${index * 100}% - ${index * gap}px))` }">
                <slot></slot>
            </div>
        </div>
        <div class="bar">
            <div v-for="(_, id) of new Array($slots.default()[0]?.children?.length)" :key="id"
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
    computed: {},
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
            index: 0
        }
    },
    methods: {},
    mounted() {
        console.log(this.$slots.default()[0]?.children);
        
    }
});

</script>

<style lang="scss" scoped>

.carousel-tab {
    .content {
        overflow: auto;

        div {
            display: flex;
            scroll-snap-type: x mandatory;
            overscroll-behavior-x: contain;
            scrollbar-width: none;
            transition: .3s;

            * {
                margin: 0 16px 0 0;
            
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