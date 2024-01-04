<template>
    <div :class="['ui-select', position, { active: isActive, disabled }]" ref="root">
        <header @click="showMenu">
            <span>{{ getHeaderLabel }}</span>
        </header>

        <Transition name="fade">
            <ul v-show="isActive">
                <SelectOption v-for="option of options" :key="option.value"
                    :class="{
                        [multi ? 'selected' : 'disabled']: selected.includes(option.value)
                    }"

                    :option="option"

                    @click="selectOption(option)"
                />
            </ul>
        </Transition>
    </div>
</template>

<script lang="tsx" setup>

import { render } from 'vue';
import { Transition } from 'vue';
import { createVNode } from 'vue';
import SelectOption, { type Option } from '~/components/models/ui/SelectOption.vue';


interface TemplateProps<T = boolean> {
    label: string;
    options: Array<any>;
    disabled?: boolean;
    multi?: T;
}

interface MultiProps extends TemplateProps<true> {
    value?: Array<string>;
}

interface NotMultiProps extends TemplateProps<false> {
    value?: string;
}

type Props = NotMultiProps | MultiProps;


const root = ref<HTMLElement | null>(null);


let header: HTMLElement,
    menu: HTMLElement;


const $emit = defineEmits({
    select: (option: any) => option,
    'select-multi': (options: Array<any>) => options
});

const props = defineProps<Props>();


const
    isActive = ref<boolean>(false),
    position = ref<'top' | 'bottom'>('bottom'),
    selected = ref<Array<string>>([]);


const getCurrentOptions = computed(() => {
    const list = selected.value;

    return props.options.filter(({ value }) => {
        return list.length > 0 ? list.includes(value) : (props?.multi ? props?.value?.includes(value) : value === props?.value);
    });
});

const getHeaderLabel = computed(() => {
    const options = getCurrentOptions.value;

    if (options.length < 1) {
        return props?.label || 'Нажми на меня';
    } else if (options.length === 1) {
        return options[0]?.label || options[0].value;
    } else {
        return options.map(({ label, value }) => label || value).join(', ');
    }
});


watch(() => isActive.value, newValue => {
    if (newValue) {
        window.addEventListener('scroll', listenWheel, true);
    } else {
        window.removeEventListener('scroll', listenWheel, true);
    }
});

watch(() => props.value, newValue => {
    if (newValue) setValue(newValue);
});


function setMenuPositionY() {
    const
        { width, top, bottom, y, x } = header.getBoundingClientRect(),
        { height } = menu.getBoundingClientRect();
        
    console.log(top, bottom, header.getBoundingClientRect());
    

    const isTop = height + bottom > window.innerHeight;

    position.value = isTop ? 'top' : 'bottom';

    menu.style.width = `${width}px`;
    menu.style.top = `${isTop ? top - height : bottom}px`;

    // setMenu(width, x, isTop ? top - height : bottom);
}

async function showMenu(event: Event) {
    if (isActive.value || !header || !menu || props.disabled) return;

    isActive.value = true;

    setTimeout(() => setMenuPositionY(), 1);

    const close = () => {
        window.addEventListener('click', event => {
            const path = (event as any)?.path || (event.composedPath ? event.composedPath() : undefined);

            if (path && path.includes(root.value) && props.multi) return close();
            
            isActive.value = false;
        }, { once: true });
    }

    setTimeout(() => close(), 10);
}

function listenWheel(event: Event) {
    setMenuPositionY();
}

function selectOption(option: Option) {
    if (option?.disabled) return;

    if (props.multi) {
        const index = selected.value.indexOf(option.value);

        if (index < 0) selected.value.push(option.value);
        else selected.value.splice(index, 1);
    } else {
        selected.value = [option.value];
    }

    const options = props.options.filter(option => {
        return selected.value.includes(option.value);
    });

    $emit('select', option);
    $emit('select-multi', options);
}

function setValue(newValue: string | Array<string>) {
    if (!props.options.find(({ value }) => props?.multi ? newValue?.includes(value) : value === newValue)) return;

    selected.value = props?.multi ? newValue as Array<string> : [newValue as string];
}


onMounted(() => {
    if (!root.value) return;

    header = root.value.querySelector('header')!;
    menu = root.value.querySelector('ul')!;

    if (props?.value) setValue(props.value);
});

</script>

<style lang="scss">

.ui-select-menu {
    position: fixed;
    max-height: clamp(32px, 50vh, 512px);
    border-radius: 0 0 5px 5px;
    border: 1px solid var(--background-secondary);
    background-color: var(--background-primary);
    box-sizing: border-box;
    transition: .2s, top 0s, border 0s;
    overflow-x: hidden;
    z-index: 999;
}

</style>

<style lang="scss" scoped>

.fade {
    &-enter-active,
    &-leave-active {
        opacity: 0;
    }
}

.ui-select {
    max-width: 100%;
    width: 100%;
    position: relative;

    &.disabled {
        header {
            cursor: not-allowed;
            background-color: var(--background-black);
            opacity: .5;
        }
    }

    &:not(.disabled) {
        &.active {
            &.top {
                header {
                    border-radius: 0 0 5px 5px;
                }

                ul {
                    border-radius: 5px 5px 0 0;
                    border-bottom: none;
                }
            }

            &.bottom {
                header {
                    border-radius: 5px 5px 0 0;
                }

                ul {
                    border-top: none;
                }
            }
        }

        header:hover,
        &.active header {
            cursor: pointer;
        }
    }

    header {
        display: flex;
        padding: 8px 12px;
        max-width: 100%;
        width: 100%;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        box-sizing: border-box;
        transition: .2s, border-radius .2s;
        overflow: hidden;
        user-select: none;

        span {
            max-width: 100%;
            color: var(--color-primary);
            font-size: 14px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    ul {
        position: fixed;
        max-height: clamp(32px, 50vh, 512px);
        border-radius: 0 0 5px 5px;
        border: 1px solid var(--background-secondary);
        background-color: var(--background-primary);
        box-sizing: border-box;
        transition: .2s, top 0s, border 0s;
        overflow-x: hidden;
        z-index: 999;
    }
}

</style>