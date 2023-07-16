<template>
    <div :class="['nav-bar', orientation, { multiselect }]" ref="root"
        @wheel.prevent.stop="orientation === 'vertical' ? null : setScroll($event)"
    >
        <ul>
            <li v-for="(btn, idx) of menu" :key="btn.label"
                :class="{ active: ids?.includes(idx) }"
                :style="{ '--color': btn?.color }"
                @click="click(idx, $event)"
                @mouseenter="hover(idx)"
                @mouseleave="hoverId = -1"
            >
                <img :src="btn?.img" v-if="btn?.img">
                <Icon :name="btn.icon" v-if="btn?.icon"/>

                <span>{{ btn.label }}</span>
            </li>

            <div :style="{
                width: `${width}px`,
                height: `${height}px`,
                top: `${orientation === 'vertical' ? top : 0}px`,
                left: `${orientation === 'horizontal' ? left : 0}px`
            }"></div>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

export interface IButton {
    label: string;
    icon?: string;
    color?: string;
    img?: string;
    value?: string;
    [key: string]: any;
    click?(event: MouseEvent, button: IButton): void;
}

const emit = defineEmits(['select']);

const root = ref<HTMLElement | null>(null);

const props = defineProps({
    defaultId: { type: Number, default: 0 },
    menu: {
        type: Object as PropType<Array<IButton>>,
        default: []
    },
    orientation: {
        type: String as PropType<'vertical' | 'horizontal'>,
        default: 'horizontal'
    },
    selected: { type: Boolean, default: true },
    multiselect: { type: Boolean, default: false },
    clearId: { type: Number }
});

const
    ids = ref<Array<number>>([]),
    width = ref<number>(0),
    height = ref<number>(0),
    top = ref<number>(0),
    left = ref<number>(0),
    hoverId = ref<number>(-1);


watch(() => hoverId.value, (newValue: number) => {
    const _ids = ids.value;

    set((newValue < 0 ? _ids[_ids.length - 1] : newValue) + 1);
});

function setScroll(e: WheelEvent) {
    root.value?.scroll({
        behavior: 'smooth',
        left: root.value?.scrollLeft + e.deltaY
    });
}

function set(position: number = 0) {
    if (!props.selected) return;

    let el: Element | any = root.value?.querySelector(`ul li:nth-child(${position})`);
    
    if (!el) return;

    width.value = el.clientWidth;
    height.value = el.clientHeight;
    top.value = el?.offsetTop;
    left.value = el?.offsetLeft;
}

function click(idx: number, e: MouseEvent) {
    const btn = props.menu[idx];

    if (props.clearId === idx || !props.multiselect) {
        ids.value = [idx];

        set(idx + 1);
    } else {
        const _ids = ids.value;

        if (props.clearId !== undefined && _ids.includes(props.clearId)) ids.value.splice(props.clearId, props.clearId + 1);
        
        ids.value = _ids?.includes(idx) ? _ids.filter(id => id !== idx) : [..._ids || [], idx];
    }

    if (ids.value.length < 1) {
        ids.value = [0];

        set(1);
    }

    emit('select', btn);

    if (btn?.click) btn?.click(e, btn);
}

function hover(idx: number) {
    if (props.selected && !ids.value.includes(idx)) {
        hoverId.value = idx;
    }
}

onMounted(() => {
    if (!props.selected) return;

    ids.value = [props.defaultId || 0];
        
    set(ids.value[0]);
});

</script>

<style lang="scss" scoped>

.nav-bar {
    max-width: 100%;
    position: relative;
    overflow-y: hidden;

    &::-webkit-scrollbar {
        display: none;
    }

    &.vertical {
        width: 100%;

        ul {
            flex-direction: column;
            align-items: flex-start;

            li {
                margin: 0 0 12px 0;
                padding: 8px 16px;
                width: 100%;
            }

            div {
                width: 100% !important;
            }
        }
    }

    &.multiselect {
        ul {
            li {
                &.active {
                    background-color: var(--background-secondary);
                }
            }
        }
    }

    ul {
        display: flex;
        position: relative;
        align-items: center;

        li {
            cursor: pointer;
            display: flex;
            margin: 0 12px 0 0;
            padding: 6px 14px;
            border-radius: 5px;
            align-items: center;
            transition: .2s;
            z-index: 2;

            &:last-child {
                margin: 0 !important;
            }

            &.active {
                span {
                    color: var(--text-primary);
                }
            }

            img {
                margin: 0 8px 0 0;
                width: 32px;
                height: 32px;
            }

            .hx-icon {
                margin: 0 8px 0 0;
                color: var(--color);
            }

            span {
                color: var(--text-secondary);
                white-space: nowrap;
                transition: .2s;
            }
        }

        div {
            height: 100%;
            position: absolute;
            top: 0;
            border-radius: 5px;
            background-color: var(--background-secondary);
            transition: .2s;
            z-index: 1;
        }
    }
}

</style>