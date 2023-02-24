<template>
    <label class="ui-textbox">
        <div :class="['label', { active: modelValue?.length > 0 }]" v-show="labelType === 'block'">{{ label }}</div>
        
        <input :type="type" :placeholder="labelType === 'input' ? label : ''" v-model="modelValue"
            @focus="$emit('focus', $event)"    
            @blur="$emit('blur', $event)"
        >

        <Transition name="width">
            <ul class="buttons" v-show="modelValue?.length > 0 && buttons?.length > 0">
                <li v-for="btn of buttons.slice(0, 3)" :key="btn.icon"
                    @click.stop.prevent=""
                >
                    <Icon name="close" :size="'14px'"/>
                </li>
                <li v-show="buttons?.length > 3">
                    <Icon name="arrow-down" :size="'14px'"/>
                </li>
            </ul>
        </Transition>
    </label>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

export type TInput = 'text' | 'password' | 'number';

export type TLabel = 'block' | 'input';

export default defineComponent({
    name: 'UITextbox',
    computed: {},
    props: {
        label: {
            type: String,
            default: 'Test'
        },
        labelType: {
            type: String as PropType<TLabel>,
            default: 'block'
        },
        value: {
            type: String
        },
        type: {
            type: String as PropType<TInput>,
            default: 'text'
        }
    },
    data: () => ({
        modelValue: '',
        buttons: [
            {
                label: '',
                icon: 'close'
            },
            {
                label: '',
                icon: 'close'
            },
            {
                label: '',
                icon: 'close'
            },
            {
                label: '',
                icon: 'close'
            }
        ],
        menu: {
            
        }
    }),
    watch: {},
    methods: {},
    mounted() {}
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

.ui-textbox {
    cursor: text;
    display: flex;
    padding: 8px 12px;
    max-width: 100%;
    width: 100%;
    position: relative;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    box-sizing: border-box;
    backdrop-filter: blur(5px);
    transition: .2s;

    .label {
        position: absolute;
        top: 8px;
        color: var(--text-secondary);
        transition: .2s;
        z-index: 1;

        &.active {
            top: -10px;
            font-size: 12px;
            color: var(--text-primary);
        }
    }

    input {
        padding: 0;
        width: 100%;
        color: var(--text-primary);
        border: none;
        background: var(--T);
        transition: .2s;
        outline: none;
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
                    --color: var(--C1);
                }
            }

            i.hx-icon {
                --color: var(--text-secondary);
            }
        }
    }
}

</style>