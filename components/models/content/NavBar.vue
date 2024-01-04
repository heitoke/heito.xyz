<template>
    <div ref="root"
        :class="['nav-bar', orientation, {
            reverse,
            left: isMask[0],
            right: isMask[1]
        }]"

        @wheel.prevent.stop="orientation === 'vertical' ? null : onWheelScroll($event)"
    >
        <ul>
            <li v-for="(item, idx) of items" :key="item.value"
                :class="{
                    active: selectedItems.includes(item.value),
                    hover: hoverIndex === idx,
                    disabled: item?.disabled
                }"
                :style="{ '--color': item?.color || 'var(--background-secondary)' }"

                @mouseenter="setHover(idx)"
                @mouseleave="clearHover()"
                @click="onClickSelect(idx, $event)"
            >
                <Icon :name="item?.icon" v-if="Boolean(item?.icon)"/>

                <span>{{ item?.label || item.value }}</span>
            </li>

            <div :style="bgItemStyle"></div>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import type { StyleValue } from 'vue';

export interface Item {
    label?: string;
    value: string;
    icon?: string;
    color?: string;
    clear?: boolean;
    disabled?: boolean;
    onlyClick?: boolean;

    click?(item: Item, event: MouseEvent): void;
}


const root = ref<HTMLElement | null>(null);


const $emit = defineEmits({
    select: (item: Item) => item,
    'select-multi': (items: Array<Item>) => items
});


const props = withDefaults(defineProps<{
    value?: string | Array<string>;
    items: Array<Item>;
    orientation?: 'vertical' | 'horizontal';
    reverse?: boolean;
    multi?: boolean;
}>(), {
    orientation: 'horizontal',
    reverse: false,
    multi: false
});


const
    isMask = ref<[boolean, boolean]>([false, true]),
    hoverIndex = ref<number>(-1),
    bgItemStyle = ref<StyleValue>();


let hoverClearTimer: NodeJS.Timeout;


const selectedItems = computed(() => {
    const isString = typeof props.value === 'string';

    if (!props.value) return isString ? '' : [];

    if (props.multi) {
        return isString ? [props.value] : props.value;
    } else {
        return isString ? props.value : props.value[0];
    }
});


function onWheelScroll(event: WheelEvent) {
    if (!root.value) return;

    const { scrollLeft, scrollWidth, offsetWidth, clientWidth } = root.value;

    if (scrollWidth <= clientWidth) return;

    const y = scrollLeft + event.deltaY;

    isMask.value = [y > 0, (scrollLeft - 10) < (scrollWidth - offsetWidth)];

    root.value.scroll({
        behavior: 'smooth',
        left: y
    });
}

function onClickSelect(idx: number, event: MouseEvent) {
    const item = props.items[idx];

    if (!item || item?.disabled) return;

    if (!item?.onlyClick && props.multi) {
        const list = new Set(item.clear ? [item.value] : selectedItems.value);
        
        list[list.has(item.value) ? 'delete' : 'add'](item.value);

        $emit('select-multi', props.items.filter(item => {
            return list.has(item.value);
        }));
    }

    if (!item?.onlyClick) $emit('select', item);

    if (item?.click) item.click(item, event);
}

function setHover(idx: number) {
    if (idx < 0) {
        hoverIndex.value = -1;
        bgItemStyle.value = {};

        return;
    }

    const item = props.items[idx];

    if (!item || item?.disabled) return;

    const saveIndex = hoverIndex.value;

    hoverIndex.value = idx;

    const itemElement = root.value?.querySelector(`ul li:nth-child(${idx + 1})`) as HTMLElement;

    if (!itemElement) return;

    clearTimeout(hoverClearTimer);

    const isVertical = props.orientation === 'vertical';

    bgItemStyle.value = {
        width: `${itemElement.clientWidth}px`,
        height: `${itemElement.clientHeight}px`,
        [isVertical ? 'top' : 'left']: `${itemElement[isVertical ? 'offsetTop' : 'offsetLeft']}px`,
        'background-color': item.color,
        transition: saveIndex < 0 ? 'none' : '.2s',
        opacity: .3
    }
}

function clearHover() {
    hoverClearTimer = setTimeout(() => {
        const currentIndex = props.items.findIndex(item => {
            return item.value === selectedItems.value[selectedItems.value.length - 1];
        });

        setHover(currentIndex);
    }, 100);
}

</script>

<style lang="scss" scoped>

.nav-bar {
    display: flex;
    max-width: 100%;
    position: relative;
    overflow-y: hidden;
    scrollbar-width: none;
    user-select: none;

    &.horizontal {
        &.right {
            mask-image: linear-gradient(90deg, #000 95%, transparent);
        }

        &.left {
            mask-image: linear-gradient(-90deg, #000 95%, transparent);

            &.right {
                mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent 100%);
            }
        }
    }

    &.vertical {
        width: 100%;

        ul {
            width: 100%;
            align-items: flex-start;
            flex-direction: column;

            li {
                &:not(:last-child) {
                    margin: 0 0 8px 0;
                    width: 100%;
                }

                div {
                    width: 100% !important;
                }
            }
        }
    }

    &.reverse {
        ul {
            li {
                flex-direction: row-reverse;

                .ui-icon {
                    margin: 0 0 0 8px;
                }
            }
        }
    }

    &::-webkit-scrollbar {
        display: none;
        scrollbar-width: none;
    }

    ul {
        display: flex;
        max-width: 100%;
        position: relative;
        align-items: center;

        li {
            cursor: pointer;
            display: flex;
            padding: 6px 14px;
            max-width: 100%;
            min-width: min-content;
            position: relative;
            border-radius: 5px;
            align-items: center;
            box-sizing: border-box;
            transition: .2s;
            overflow: hidden;
            z-index: 2;

            &:not(:last-child) {
                margin-right: 12px;
            }

            &.disabled {
                cursor: not-allowed;
                // pointer-events: none;
                opacity: .5;
            }

            &:hover,
            &.active {
                span {
                    color: var(--text-primary);
                }
            }

            &::after {
                content: "";
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: var(--color);
                transition: .2s;
                opacity: 0;
                z-index: 1;
            }

            &.active {
                .ui-icon {
                    color: var(--color);
                }

                &:not(.hover)::after {
                    opacity: .3;
                }
            }

            .ui-icon {
                margin-right: 8px;
                color: var(--text-secondary);
                z-index: 2;
            }

            span {
                max-width: 100%;
                color: var(--text-secondary);
                font-size: 14px;
                text-overflow: ellipsis;
                white-space: nowrap;
                transition: .2s;
                overflow: hidden;
                z-index: 2;
            }
        }

        & > div {
            height: 100%;
            position: absolute;
            top: 0;
            border-radius: 5px;
            background-color: var(--background-secondary);
            transition: all .2s;
            z-index: 1;
        }
    }
}

</style>