<template>
    <div :class="`nav-bar ${orientation}`"
        @wheel.prevent.stop="setScroll"
    >
        <ul>
            <li v-for="(btn, idx) of menu" :key="btn.label"
                :class="{ active: id === idx }"
                :style="{ '--color': btn?.color }"
                @click="selected ? id = idx : $emit('select', btn)"
                @mouseenter="selected ? (id === idx ? null : hoverId = idx) : null"
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

<script lang="ts">

import { defineComponent, PropType } from 'vue';

export interface IButton {
    label: string;
    icon?: string;
    color?: string;
    img?: string;
    value?: string;
    [key: string]: any;
}

export default defineComponent({
    name: 'NavBar',
    computed: {},
    props: {
        defaultId: {
            type: Number
        },
        menu: {
            type: Object as PropType<Array<IButton>>,
            default: []
        },
        orientation: {
            type: String as PropType<'vertical' | 'horizontal'>,
            default: 'horizontal'
        },
        selected: {
            type: Boolean,
            default: true
        }
    },
    emits: {
        select(btn: IButton): IButton {
            return btn;
        }
    },
    data() {
        return {
            id: -1,
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            hoverId: -1
        }
    },
    watch: {
        id(newValue: number, oldValue: number) {
            this.set(newValue + 1);

            this.$emit('select', this.menu[this.id]);
        },
        hoverId(newValue: number, oldValue: number) {
            if (newValue < 0) this.set(this.id + 1);
            else this.set(newValue + 1);
        }
    },
    methods: {
        setScroll(e: WheelEvent) {
            let el = this.$el as Element;
            
            el.scroll({
                behavior: 'smooth',
                left: el.scrollLeft + e.deltaY
            });
        },
        set(position: number = 0) {
            if (!this.selected) return;

            let el: Element | any = (this.$el as Element)?.querySelector(`ul li:nth-child(${position})`);

            if (!el) return;

            this.width = el.clientWidth;
            this.height = el.clientHeight;
            this.top = el?.offsetTop;
            this.left = el?.offsetLeft;
        }
    },
    mounted() {
        this.id = this.defaultId || 0;
        this.set(this.id + 1);
    }
})

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
                width: 100%;
            }

            div {
                width: 100% !important;
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