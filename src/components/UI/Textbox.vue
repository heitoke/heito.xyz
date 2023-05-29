<template>
    <label :class="['ui-textbox', { error, icon: Boolean(icon) }]"
        :style="{ '--left': `${isValid ? labelWidth : 0}px` }"
        @click="($event.target as any).focus()"
    >
        <Icon :name="icon" style="margin: 0 8px 0 0;" v-show="Boolean(icon)"/>

        <input :type="type" :placeholder="labelType === 'input' ? label : text" v-model="modelValue"
            :style="{ '--placeholder-color': focus ? 'var(--text-secondary)' : 'var(--T)' }"
            @focus="$emit('focus', $event); focus = true"    
            @blur="$emit('blur', $event); focus = false"
        >
        
        <div :class="['label', { active: isValid }]" v-show="labelType === 'block'">{{ label }}</div>

        <Menu v-if="menu === true && buttons?.length > 3" :menu="{
            name: 'textbox:menu',
            buttons: (buttons as IContextMenuButton[])
        }"/>

        <!-- <Transition name="width">
            <ul class="buttons" v-show="modelValue?.length > 0 && buttons?.length > 0">
                <li v-for="btn in buttons.slice(0, 3)" :key="btn"
                    @click.stop.prevent=""
                >
                    <Icon name="close" :size="'14px'"/>
                </li>
                <li v-show="buttons?.length > 3" @click="menu = !menu">
                    <Icon name="arrow-down" :size="'14px'"/>
                </li>
            </ul>
        </Transition> -->
    </label>
</template>

<script lang="ts" setup>

import Menu from '../content/Menu.vue';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import type { IContextMenuButton } from '../../store/modules/contextMenu';

export type TInput = 'text' | 'password' | 'number';

export type TLabel = 'block' | 'input';

export default defineComponent({
    name: 'UITextbox',
    computed: {
        isValid(): boolean {
            let is = this.modelValue?.length > 0 || this.focus;

            if (is) this.setLabelWidth();

            return is;
        }
    },
    props: {
        label: { type: String, default: 'Test' },
        labelType: {
            type: String as PropType<TLabel>,
            default: 'block'
        },
        value: { type: String },
        icon: { type: String },
        text: { type: String },
        type: {
            type: String as PropType<TInput>,
            default: 'text'
        },
        match: { type: RegExp, default: /(.*)/ },
        min: { type: Number, default: 0 },
        max: { type: Number, default: 256 },
        autofocus: { type: Boolean, default: false },
        watchValue: { type: Boolean, default: false }
    },
    data: () => ({
        focus: false,
        modelValue: '',
        menu: false,
        error: false,
        labelWidth: 0,
        buttons: [
            // {
            //     label: 'Close',
            //     icon: 'close'
            // },
            // {
            //     label: 'Close',
            //     icon: 'close'
            // },
            // {
            //     label: 'Close',
            //     icon: 'close'
            // },
            // {
            //     label: 'Close',
            //     icon: 'close'
            // }
        ]
    }),
    watch: {
        modelValue(newValue: string) {
            this.error = !this.match.test(newValue) || newValue.length > this.max || newValue.length < this.min;

            if (this.error) return;

            this.$emit('update', newValue);
        }
    },
    methods: {
        setLabelWidth() {
            let label = (this.$el as Element)?.querySelector('.label'),
                oldWidth = label?.scrollWidth as number;

            setTimeout(() => {
                let now = label?.scrollWidth as number;

                if (now <= this.labelWidth) return;

                this.labelWidth = now - (now - oldWidth - 12);
            }, 100);
        }
    },
    mounted() {
        this.modelValue = this.value || '';

        if (this.watchValue) this.$watch('value', (newValue) => {
            this.modelValue = newValue || '';
        });
        
        this.setLabelWidth();
        
        if (this.autofocus) {
            this.$el?.querySelector('input')?.focus();
        }
    }
});

</script>

<style lang="scss" scoped>

.width-enter-active {
    animation: Width .2s linear;
}

.width-leave-active {
    animation: Width .2s linear reverse;
}

@keyframes Width {
    from {
        // max-width: 0px;
        // width: 0px;
        // min-width: 0px;
        transform: translateX(12px) scale(.8);
        transform-origin: center right;
        opacity: 0;
    }
}

$bg: linear-gradient(var(--background-secondary), var(--background-secondary));

.ui-textbox {
    cursor: text;
    display: flex;
    padding: 8px 12px;
    max-width: 100%;
    width: 100%;
    position: relative;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    border-top-color: var(--T);
    box-sizing: border-box;
    background: $bg, $bg;
    background-size: 6px 1px, calc(100% - var(--left)) 1px;
    background-repeat: no-repeat, no-repeat;
    background-position: left top, right top;
    transition: .2s;

    &.error {
        $bg: linear-gradient(var(--red), var(--red));

        border: 1px solid var(--red);
        border-top-color: var(--T);
        box-sizing: border-box;
        background: $bg, $bg;
        background-size: 6px 1px, calc(100% - var(--left)) 1px;
        background-repeat: no-repeat, no-repeat;
        background-position: left top, right top;
    }

    &.icon {
        .label {
            left: 36px;
        }
    }

    .label {
        position: absolute;
        top: 8px;
        color: var(--text-secondary);
        transition: .2s;
        user-select: none;
        z-index: 1;

        &.active {
            top: -10px;
            left: 12px;
            font-size: 12px;
            color: var(--text-primary);
        }
    }

    input {
        padding: 0;
        width: 100%;
        color: var(--text-primary);
        caret-color: var(--main-color);
        border: none;
        background: var(--T);
        transition: .2s;
        outline: none;
    
        &:focus + .label {
            top: -10px;
            font-size: 12px;
            color: var(--text-primary);
        }

        &::-webkit-input-placeholder {
            color: var(--placeholder-color);
        }
        &:-moz-placeholder {
            color: var(--placeholder-color);
            opacity: 1;
        }
        &::-moz-placeholder {
            color: var(--placeholder-color);
            opacity: 1;
        }
        &:-ms-input-placeholder {
            color: var(--placeholder-color);
        }
        &::-ms-input-placeholder {
            color: var(--placeholder-color);
        }
        &::placeholder {
            color: var(--placeholder-color);
        }

        &[placeholder] {
            transition: .2s;
        }
    }

    ul.buttons {
        display: flex;
        margin: 0 0 0 12px;
        padding: 0 0 0 12px;
        height: 16px;
        border-left: 1px solid var(--background-secondary);
        align-items: center;

        li {
            cursor: pointer;
            margin: 0 4px 0 0;
            transform: translateY(3px);

            &:last-child {
                margin: 0;
            }

            &:hover {
                i.hx-icon {
                    --color: var(--main-color);
                }
            }

            i.hx-icon {
                --color: var(--text-secondary);
            }
        }
    }

    .menu {
        padding: 8px;
        width: 100%;
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        background-color: var(--background-secondary);
        box-sizing: border-box;
        z-index: 3;
    }
}

</style>