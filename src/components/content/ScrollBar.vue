<template>
    <div class="scrollbar">
        <div scrollbar-body @scroll="setScrollHeight">
            <div scrollbar-content>
                <slot
                    :toScroll="toScroll"
                    :scroll="{ x, y, top, left, max, client }"
                ></slot>
            </div>
        </div>

        <div scrollbar-strip class="y" v-show="orientation !== 'x' && client.height !== max.height"
            :class="{ active: droped }"
            :style="{ right: `${inset ? -4 : 0}px` }"
        >
            <div @pointerdown="down"></div>
        </div>
    </div>
</template>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

type TSize = {
    width: number;
    height: number;
}

export interface IScrollBar {
    toScroll(x: number, y: number): void;
    scroll: {
        x: number;
        y: number;
        top: number;
        left: number;
        max: TSize;
        client: TSize;
    }
}

export default defineComponent({
    name: 'ScrollBar',
    computed: {},
    props: {
        orientation: {
            type: String as PropType<'all' | 'y' | 'x'>,
            default: 'y'
        },
        inset: {
            type: Boolean,
            default: false
        },
        boost: {
            type: Number,
            default: 10.5
        }
    },
    data: () => ({
        droped: false,
        save: {
            x: 0,
            y: 0
        },
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        max: {
            width: 0,
            height: 0
        },
        client: {
            width: 0,
            height: 0
        },
        show: false
    }),
    methods: {
        refs() {
            const
                container = this.$el as HTMLElement,
                body = container.querySelector('[scrollbar-body]')! as HTMLElement;

            return {
                container,
                body,
                content: body.querySelector('[scrollbar-content]')! as HTMLElement,
                scroll: container.querySelector('[scrollbar-strip]')! as HTMLElement
            }
        },
        setScrollHeight() {
            const { container, body, scroll } = this.refs();

            const
                height = Math.pow(container.clientHeight, 2) / body.scrollHeight - 16,
                y = body.clientHeight * body.scrollTop / body.scrollHeight;

            this.y = y;

            this.max = {
                width: body.scrollWidth,
                height: body.scrollHeight
            }

            this.client = {
                width: body.clientWidth,
                height: body.clientHeight
            }

            this.top = body.scrollTop;
            this.left = body.scrollLeft;
            
            scroll.querySelector('div')?.setAttribute('style', `height: ${height}px; top: ${body.clientHeight * body.scrollTop / body.scrollHeight}px;`);
        },
        toScroll(x: number, y: number) {
            const { body } = this.refs();

            body?.scrollTo({
                top: y,
                left: x,
                behavior: 'smooth'
            });
        },
        observeHeight() {
            const { content } = this.refs();

            const resizeObserver = new ResizeObserver(() => {
                this.setScrollHeight();
            });

            resizeObserver.observe(content);
        },
        down(ev: PointerEvent) {
            this.droped = true;

            this.save = { x: ev.clientX, y: ev.clientY };

            window.addEventListener('pointermove', this.move);

            window.addEventListener('pointerup', () => {
                this.droped = false;
            }, { once: true });
        },
        move(ev: PointerEvent) {
            if (!this.droped) return;

            let y = ev.clientY > this.save.y ? this.top + ((ev.clientY - this.save.y) * this.boost) : this.top - ((this.save.y - ev.clientY) * this.boost);

            this.save = { x: ev.clientX, y: ev.clientY };

            this.toScroll(0, y);
        }
    },
    mounted() {
        if (window) {
            this.show = true;

            this.setScrollHeight();

            this.observeHeight();
        }
    }
})

</script>

<style lang="scss" scoped>

.scrollbar {
    max-width: 100%;
    position: relative;
    box-sizing:border-box;
    overflow: hidden;

    &:hover {
        [scrollbar-strip] {
            transform: scale(1);
            opacity: 1;
        }
    }

    [scrollbar-body] {
        width: 100%;
        height: 100%;
        overflow-x: hidden;

        &:hover + [scrollbar-strip] {
            opacity: .5;
        }
    }

    [scrollbar-content] {
        width: 100%;
        height: 100%;
    }

    [scrollbar-strip] {
        position: absolute;
        transform-origin: center right;
        transform: scale(.85);
        transition: .2s;
        z-index: 101;
        mix-blend-mode: difference;
        user-select: none;
        overflow: hidden;
        opacity: 0;

        &.y {
            padding: 8px 4px;
            width: 2px;
            height: calc(100% - 16px);
            top: 0;
            right: 0;
        }

        &.x {
            padding: 4px 8px;
            width: calc(100% - 16px);
            height: 2px;
            left: 0;
            bottom: 0;
        }

        &:hover, &.active {
            width: 8px;
            background-color: #7f7f7f41;
            transform: scale(1);
            mix-blend-mode: normal;
            opacity: 1 !important;
        }

        &.active {
            div {
                background-color: var(--main-color);
                mix-blend-mode: normal;
            }
        }

        div {
            cursor: row-resize;
            width: 100%;
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