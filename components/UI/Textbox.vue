<template>
    <label ref="root" :class="['ui-textbox', { error, icon: Boolean(icon) }]"
        :style="{ '--left': `${isValid ? labelWidth : 0}px` }"
        @click="($event.target as any).focus()"
    >
        <Icon :name="icon" style="margin: 0 8px 0 0;" v-show="Boolean(icon)"/>

        <input v-model="modelValue" v-if="type !== 'area'"
            :placeholder="labelType === 'input' ? label : text"
            :readonly="readonly"
            :style="{ '--placeholder-color': `var(--${focus ? 'text-secondary' : 'T'})` }"
            @focus="emit('focus', $event); focus = true"    
            @blur="emit('blur', $event); focus = false"
        >

        <textarea v-model="modelValue" v-if="type === 'area'"
            :placeholder="labelType === 'input' ? label : text"
            :readonly="readonly"
            :style="{ '--placeholder-color': `var(--${focus ? 'text-secondary' : 'T'})` }"
            @focus="emit('focus', $event); focus = true"    
            @blur="emit('blur', $event); focus = false"
        ></textarea>
        
        <div :class="['label', { active: isValid }]" v-show="labelType === 'block'">{{ label }}</div>
    </label>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

export type TInput = 'text' | 'password' | 'number' | 'area';

export type TLabel = 'block' | 'input';

const root = ref<HTMLElement | null>();

const emit = defineEmits(['update', 'focus', 'blur']);

const props = defineProps({
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
    watchValue: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false }
});

const isValid = computed(() => {
    let is = modelValue.value?.length > 0 || focus;

    if (is) setLabelWidth();

    return is;
});

const
    focus = ref(false),
    modelValue = ref(''),
    menu = ref(false),
    error = ref(false),
    labelWidth = ref(0);


watch(modelValue, (newValue: string) => {
    error.value = !props.match.test(newValue) || newValue.length > props.max || newValue.length < props.min;

    if (error) return;

    emit('update', newValue);
});

function setLabelWidth() {
    let label = root.value?.querySelector('.label'),
        oldWidth = label?.scrollWidth as number;

    setTimeout(() => {
        let now = label?.scrollWidth as number;

        if (now <= labelWidth.value) return;

        labelWidth.value = now - (now - oldWidth - 12);
    }, 100);
}

onMounted(() => {
    modelValue.value = props.value || '';

    if (props.watchValue) watch(props.value, (newValue: any) => {
        modelValue.value = newValue || '';
    });
    
    setLabelWidth();

    if (props.autofocus) {
        root.value?.querySelector(props.type === 'area' ? 'textarea' : 'input')?.focus();
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
        white-space: nowrap;
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

    input, textarea {
        padding: 0;
        width: 100%;
        color: var(--text-primary);
        caret-color: var(--main-color);
        border: none;
        background: var(--T);
        transition: .2s;
        resize: vertical;
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

    textarea {
        height: auto;
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