<template>
    <label ref="root"
        :class="['ui-textbox', { active: isActive, icon: Boolean(icon) }]"
        :style="{ '--left': `${isActive ? labelWidth + 18 : 0}px` }"
        @click="($event.target as any).focus()"
    >
        <Icon :name="icon" v-if="Boolean(icon)"/>

        <component :is="type === 'area' ? 'textarea' : 'input'"
            :type="type"
            :readonly="readonly"
            :disabled="disabled"
            :required="true"

            @input="onInput($event)"
            @focus="emit('focus', $event); focus = true"    
            @blur="emit('blur', $event); focus = false"
        />
        
        <div class="label">{{ label }}</div>
    </label>
</template>

<script lang="ts" setup>

export type TypeInput = 'text' | 'password' | 'number' | 'area';

export type TypeLabel = 'block' | 'input';

interface InputEvent extends Event {
    target: HTMLInputElement;
}


const root = ref<HTMLElement | null>(null);

const emit = defineEmits({
    input: (input: InputEvent) => input,
    update: (value: string) => value,
    focus: (event: InputEvent) => event,
    blur: (event: InputEvent) => event
});


const props = withDefaults(defineProps<{
    label: string;
    type?: TypeInput;
    value?: string;
    icon?: string;

    disabled?: boolean;
    autofocus?: boolean;
    readonly?: boolean;
}>(), {
    type: 'text',
    disabled: false,
    autofocus: false,
    readonly: false
});


const
    focus = ref<boolean>(false),
    modelValue = ref<string>(''),
    labelWidth = ref<number>(0);


let input: HTMLInputElement;


const isActive = computed(() => {
    const is = modelValue.value.length > 0 || focus.value;

    if (is) setLabelWidth();

    return is;
});


watch(() => props.label, (newValue: string, oldValue: string) => {
    if (newValue === oldValue) return;
    
    setLabelWidth();
});

watch(() => props.value, value => {
    if (!input) return;

    input.value = value || '';
});


function setLabelWidth() {
    setTimeout(() => {
        const label = root.value?.querySelector('.label');

        labelWidth.value = label?.scrollWidth as number;
    }, 200);
}

function onInput(event: InputEvent) {
    const value = event.target.value;

    modelValue.value = value;

    emit('input', event);
    emit('update', value);
}


onMounted(() => {
    if (!root.value) return;

    input = root.value?.querySelector('input, textarea')! as HTMLInputElement;

    if (props?.value) {
        modelValue.value = input.value = props?.value;
    }

    if (props.autofocus) input?.focus();
});

</script>

<style lang="scss" scoped>

$bg: linear-gradient(var(--background-secondary), var(--background-secondary));

.ui-textbox {
    display: flex;
    max-width: 100%;
    width: 100%;
    position: relative;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    border-top-color: var(--T);
    align-items: center;
    box-sizing: border-box;
    background: $bg, $bg;
    background-color: transparent;
    background-size: 6px 1px, calc(100% - var(--left)) 1px;
    background-repeat: no-repeat, no-repeat;
    background-position: left top, right top;
    transition: background .1s;

    &.icon {
        .label {
            left: 40px;
        }
    }

    .ui-icon {
        margin-left: 12px;
    }

    &.active {
        background-color: var(--T);

        .label {
            top: -10px;
            left: 12px;
            font-size: 12px;
            color: var(--text-primary);
        }
    }

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

    .label {
        cursor: default;
        max-width: calc(100% - 24px);
        position: absolute;
        top: 8px;
        left: 12px;
        color: var(--text-secondary);
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: .2s;
        user-select: none;
        z-index: 1;
        overflow: hidden;
    }

    input, textarea {
        cursor: text;
        padding: 8px 12px;
        width: 100%;
        color: var(--text-primary);
        caret-color: var(--main-color);
        border: none;
        background: var(--T);
        transition: .2s;
        resize: vertical;
        outline: none;
    
        &:focus {
            border-color: var(--main-color);

            & + .label {
                top: -10px;
                font-size: 12px;
                color: var(--text-primary);
            }
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


        &:disabled {
            background-color: var(--background-secondary);
            opacity: .7;
        }
    }

    textarea {
        height: auto;
        min-height: 18px;
    }
}

</style>