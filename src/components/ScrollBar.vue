<template>
    <div class="scrollbar">
        <div scrollbar-block @scroll="setScroll($event.target as Element, true)" ref="el">
            <slot
                :scrollPercentY="scroll || 0"
                :scrollY="y"
                :scrollHeight="scrollHeight"
                :toScroll="toScroll"
            ></slot>
        </div>
        <div :class="['indicator', { active: height }]" v-show="scrollHeight < 100">
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
                return 100 - (100 * (this.height - this.getWinHeight) / this.height);
            } else return 0;
        },
        scroll(): number {
            if (this.show) {
                let hMaxP = 100 - this.scrollHeight;
                return hMaxP * this.y / (this.height - this.getWinHeight);
            } else return 0;
        }
    },
    data: () => ({
        x: 0,
        y: 0,
        height: 0,
        show: false,
        hover: false,
        hasSlotContent: false
    }),
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
                console.log(123);
                
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
        }
    },
    mounted() {
        if (window) {
            this.show = true;

            this.setScroll(this.$refs.el as Element, true);
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
    [scrollbar-block] {
        max-height: 100vh;
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
        overflow: hidden;
        opacity: 0;

        div {
            cursor: row-resize;
            width: 2px;
            position: relative;
            background-color: #fff;
            transition: .2s;

            &:hover {
                background-color: var(--C1);
            }
        }
    }
}

</style>