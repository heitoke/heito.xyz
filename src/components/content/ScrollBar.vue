<template>
    <div class="scrollbar">
        <div scrollbar-block :style="{ 'max-height': maxHeight }"
            @scroll="setScroll($event.target as Element, true)" ref="el"
        >
            <slot
                :scrollPercentY="scroll || 0"
                :scrollY="y"
                :scrollHeight="scrollHeight"
                :scrollMaxHeight="elementHeight.max"
                :toScroll="toScroll"
                :element="$el"
            ></slot>
        </div>
        <div :class="['indicator', { active: elementHeight.value }]" v-show="scrollHeight < 100"
            :style="{ height: `calc(${maxHeight} - 16px)`, right: `${inset ? -8 : 4}px` }"
        >
            <div :style="{ top: `${scroll}%`, height: `${scrollHeight}%` }"></div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'ScrollBar',
    computed: {
        ...mapGetters(['getWinHeight']),
        scrollHeight(): number {
            if (this.show) {
                return 100 - (100 * (this.elementHeight.value - (this.elementHeight.client || 0)) / this.elementHeight.value);
            }
            
            return 0;
        },
        scroll(): number {
            if (this.show) {
                const heightMax = 100 - this.scrollHeight;
                return heightMax * this.y / (this.elementHeight.value - (this.elementHeight.client || 0));
            }

            return 0;
        }
    },
    props: {
        maxHeight: {
            type: String,
            default: '100%'
        },
        inset: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        x: 0,
        y: 0,
        elementHeight: {
            max: 0,
            value: 0,
            client: 0
        },
        show: false
    }),
    watch: {
        y(newValue: number) {
            if ((newValue + 35) >= this.elementHeight.max) {
                this.setHeight();
            }
        }
    },
    methods: {
        setScroll(el: Element, set: boolean = false) {
            if (!el) return;

            this.x = 0;
            this.y = el.scrollTop;

            if (!set) return;

            let coll: HTMLCollection = el?.children;

            this.elementHeight.value = 0;

            for (let i = 0; i < coll.length; i++)
                this.elementHeight.value += coll[i]?.scrollHeight;
        },
        checkForSlotContent() {
            let checkForContent = (hasContent: any, node: any) => {
                return hasContent || node.tag || (node.text && node.text.trim());
            }

            setTimeout(() => {
                this.setScroll(this.$refs.el as Element);
            }, 10);

            return this.$slots.default && this.$slots.default()?.reduce(checkForContent, false);
        },
        toScroll(x: number, y: number) {
            const el: Element = this.$refs?.el as Element;

            el?.scrollTo({
                top: y,
                left: x,
                behavior: 'smooth'
            });
        },
        setHeight() {
            const el = (this.$refs?.el as Element);
    
            this.elementHeight = {
                value: el?.scrollHeight,
                max: (el?.scrollHeight || 0) - document.documentElement?.clientHeight,
                client: el?.clientHeight
            }
        },
        observeHeight() {
            const el = (this.$refs?.el as Element);

            const resizeObserver = new ResizeObserver(() => {
                this.setHeight();
            });

            resizeObserver.observe(el);
        }
    },
    mounted() {
        if (window) {
            this.show = true;

            this.setScroll(this.$refs.el as Element, true);

            this.setHeight();

            this.observeHeight();
        }
    }
})

</script>

<style lang="scss" scoped>

.scrollbar {
    position: relative;

    [scrollbar-block] {
        max-height: 100%;
        height: 100%;
        overflow-x: hidden;

        &:hover {
            & + .indicator {
                transform: scale(1);
                opacity: 1;
            }
        }
    }

    .indicator {
        width: 2px;
        height: calc(100vh - 16px);
        position: absolute;
        top: 8px;
        right: 4px;
        background-color: #7f7f7f41;
        transform-origin: center right;
        transform: scale(.85);
        transition: .2s;
        z-index: 101;
        overflow: hidden;
        opacity: 0;

        div {
            cursor: row-resize;
            width: 2px;
            position: relative;
            background-color: #fff;
            transition: .2s;

            &:hover {
                background-color: var(--main-color);
            }
        }
    }
}

</style>