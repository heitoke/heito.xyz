<template>
    <div class="scrollbar">
        <div scrollbar-block :style="{ 'max-height': maxHeight }"
            @scroll="setScroll($event.target as Element, true)" ref="el"
        >
            <slot
                :scrollPercentY="scroll || 0"
                :scrollY="y"
                :scrollHeight="scrollHeight"
                :scrollMaxHeight="heightMax"
                :toScroll="toScroll"
            ></slot>
        </div>
        <div :class="['indicator', { active: height }]" :style="{ height: `calc(${maxHeight} - 16px)` }" v-show="scrollHeight < 100">
            <div :style="{ top: `${scroll}%`, height: `${scrollHeight}%` }"></div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'MainScrollBar',
    computed: {
        ...mapGetters(['getScrollY', 'getWinHeight']),
        scrollHeight(): number {
            if (this.show) {
                let el = (this.$el as Element).querySelector('[scrollbar-block]');
                return 100 - (100 * (this.height - (el?.clientHeight || 0)) / this.height);
            } else return 0;
        },
        scroll(): number {
            if (this.show) {
                let hMaxP = 100 - this.scrollHeight;
                let el = (this.$el as Element).querySelector('[scrollbar-block]');
                return hMaxP * this.y / (this.height - (el?.clientHeight || 0));
            } else return 0;
        }
    },
    props: {
        maxHeight: {
            type: String,
            default: '100vh'
        }
    },
    data: () => ({
        x: 0,
        y: 0,
        height: 0,
        heightMax: 0,
        show: false,
        hover: false,
        hasSlotContent: false
    }),
    watch: {
        y(newValue: number) {
            if ((newValue + 35) >= this.heightMax) {
                this.setMaxHeight();
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

            this.height = 0;

            for (let i = 0; i < coll.length; i++)
                this.height += coll[i]?.scrollHeight;
            


            // this.height = el?.lastElementChild?.scrollHeight as number;
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
            let el: Element = this.$refs?.el as Element;

            el?.scrollTo({
                top: y,
                left: x,
                behavior: 'smooth'
            });
        },
        setMaxHeight() {
            let el = (this.$el as Element).querySelector('[scrollbar-block]');
    
            this.heightMax = (el?.scrollHeight || 0) - document.documentElement?.clientHeight;
        }
    },
    mounted() {
        if (window) {
            this.show = true;

            this.setScroll(this.$refs.el as Element, true);

            this.setMaxHeight();
        }
    },
    beforeUpdate() {
        this.hasSlotContent = this.checkForSlotContent();
    },
    created() {
        this.hasSlotContent = this.checkForSlotContent();
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