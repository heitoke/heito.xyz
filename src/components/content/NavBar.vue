<template>
    <div class="nav-bar">
        <ul>
            <li v-for="(btn, idx) of menu" :key="btn.label"
                :class="{ active: id === idx }"
                :style="{ '--color': btn?.color }"
                @click="id = idx"
                @mouseenter="id === idx ? null : hoverId = idx"
                @mouseleave="hoverId = -1"
            >
                <Icon :name="btn.icon" v-if="btn?.icon"/>
                <span>{{ btn.label }}</span>
            </li>
            <div :style="{ width: `${width}px`, left: `${left}px` }"></div>
        </ul>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import type { TIcon } from '../../libs/types';

export interface IButtons {
    label: string;
    icon?: TIcon;
    color?: string;
}

export default defineComponent({
    name: 'NavBar',
    computed: {},
    props: {
        defaultId: {
            type: Number
        },
        menu: {
            type: Object as PropType<IButtons[] | any>
        }
    },
    data() {
        return {
            id: 0,
            width: 0,
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
        log(...args: any) {
            console.log(...args);
            
        },
        set(position: number = 0) {
            let el: Element | any = (this.$el as Element)?.querySelector(`ul li:nth-child(${position})`);

            this.width = el.clientWidth;
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
                margin: 0;
            }

            &.active {
                span {
                    color: var(--text-primary);
                }
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