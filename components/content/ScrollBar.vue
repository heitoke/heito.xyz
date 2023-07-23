<template>
    <div class="scrollbar" ref="root">
        <div scrollbar-body ref="body" :style="{ maxHeight }" @scroll="setScrollHeight">
            <div scrollbar-content ref="content">
                <slot
                    :toScroll="toScroll"
                    :scroll="{ x, y, top, left, max, client }"
                ></slot>
            </div>
        </div>

        <div scrollbar-strip ref="strip" class="y" v-show="orientation !== 'x' && client.height !== max.height"
            :class="{ active: droped }"
            :style="{ right: `${inset ? -4 : 0}px` }"
        >
            <div @pointerdown="down"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

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
        max: TSize & { left: number; top: number; };
        client: TSize;
    }
}

const { $win } = useNuxtApp();

const
    root = ref<HTMLElement | null>(null),
    body = ref<HTMLElement | null>(null),
    content = ref<HTMLElement | null>(null),
    strip = ref<HTMLElement | null>(null);

const props = defineProps({
    orientation: {
        type: String as PropType<'all' | 'y' | 'x'>,
        default: 'y'
    },
    inset: { type: Boolean, default: false },
    boost: { type: Number, default: 10.5 },
    maxHeight: { type: String, default: '100%' }
});

const
    droped = ref<boolean>(false),
    save = ref({ x: 0, y: 0 }),
    x = ref<number>(0),
    y = ref<number>(0),
    top = ref<number>(0),
    left = ref<number>(0),
    max = ref({ width: 0, height: 0, left: 0, top: 0 }),
    client = ref({ width: 0, height: 0 });

let lastPosition: { x: number; y: number; } = {
    x: 0,
    y: 0
};

function refs() {
    return {
        container: root.value!,
        body: body.value!,
        content: content.value!,
        scroll: strip.value!
    }
}

function setScrollHeight() {
    const { container, body, scroll } = refs();

    const
        height = Math.pow(container?.clientHeight || 0, 2) / (body?.scrollHeight || 0) - 16,
        _y = (body?.clientHeight || 0) * (body?.scrollTop || 0) / (body?.scrollHeight || 0);

    y.value = _y;

    max.value = {
        width: body?.scrollWidth,
        height: body?.scrollHeight,
        left: body?.scrollWidth - $win.size.width,
        top: body?.scrollHeight - $win.size.height,
    }

    client.value = {
        width: body?.clientWidth,
        height: body?.clientHeight
    }

    top.value = body?.scrollTop;
    left.value = body?.scrollLeft;
    
    scroll?.querySelector('div')?.setAttribute('style', `height: ${height}px; top: ${body?.clientHeight * body?.scrollTop / body?.scrollHeight}px;`);
}

function toScroll(x: number, y: number) {
    const { body } = refs();

    body?.scrollTo({
        top: y,
        left: x,
        behavior: 'smooth'
    });
}

function observeHeight() {
    const { content } = refs();

    const resizeObserver = new ResizeObserver(() => {
        setScrollHeight();
    });

    resizeObserver.observe(content);
}

function move(event: PointerEvent) {
    if (!droped.value) return;

    const directionY = event?.movementY || (event as any)?.mozMovementY || (event as any)?.webkitMovementY || 0;
    
    const y = directionY > 0 ? top.value + (directionY * props.boost) : top.value - (Math.abs(directionY) * props.boost);

    // const y = ev.clientY > save.value.y ? top.value + ((ev.clientY - save.value.y) * props.boost) : top.value - ((save.value.y - ev.clientY) * props.boost);

    // save.value = { x: ev.clientX, y: ev.clientY };

    toScroll(0, y);
}

function down(ev: PointerEvent) {
    droped.value = true;

    save.value = { x: ev.clientX, y: ev.clientY };

    window.addEventListener('pointermove', move);

    window.addEventListener('pointerup', () => {
        droped.value = false;
    }, { once: true });
}

onMounted(() => {
    // setTimeout(() => {
    //     setScrollHeight();

    //     observeHeight();
    // }, 500);
});

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
        // height: 100%;
        position: relative;
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