<template>
    <div :class="['ui-select', { readonly }]" ref="root">
        <header @click="open(text)">
            <Textbox :label="label" :icon="getItem?.icon" :value="getItem?.label" :watchValue="true" :readonly="readonly"
                @input="text = ($event.target as any)?.value; open(text); $emit('input', $event)"
            />
        </header>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { ItemButton, Item } from '~/types/stores/contextMenu';

export interface IMenuButton {
    label: string;
    text: string;
    value: string;
    icon: string;
    color: string;
    img: string;
}

const contextMenu = useContextMenuStore();

const root = ref<HTMLElement | null>(null);

const emit = defineEmits(['select']);

const props = defineProps({
    label: { type: String },
    value: { type: String },
    menu: { type: Object as PropType<Array<Omit<ItemButton, 'type'>>> },
    position: {
        type: String as PropType<'bottom' | 'top'>,
        default: 'bottom'
    },
    search: { type: Boolean, default: true },
    sort: { type: Boolean, default: true },
    readonly: { type: Boolean, default: true }
});

const
    selected = ref<string>(''),
    text = ref<string>(''),
    isOpen = ref<boolean>(false);

const getItem = computed(() => {
    const buttonIndex = props.menu?.findIndex(btn => btn.value === (selected.value || props.value))!;

    return props.menu![buttonIndex] || {};
});

watch(() => props.menu?.length, () => {
    if (isOpen.value) open(text.value);
});


function open(text: string = '') {
    contextMenu.close();

    const regex = new RegExp(text, 'g');

    const sort = props.sort ? props.menu?.filter(x => regex.test(x.label) || regex.test(x?.value as any)) : props.menu;

    isOpen.value = false;

    let items: Array<Item> = [];

    console.log(sort);
    

    if (sort?.length! < 1) {
        items = [...items, {
            type: 'component',
            name: 'alert',
            component: 'Alert',
            props: { type: 'mini' }
        }];
    } else {
        items = sort?.map(btn => ({
            ...btn,
            type: 'button',
            click: (e: MouseEvent) => {
                if (btn?.click) btn?.click(e);

                selected.value = btn.value as string;

                emit('select', getItem.value);

                contextMenu.close();

                isOpen.value = false;
            }
        })) as Array<ItemButton>;
    }

    contextMenu.create({
        name: 'ui-select',
        position: [props.position, 'center', 'fixed'],
        event: root?.value!,
        items
    });
}

</script>

<style lang="scss" scoped>

.ui-select {
    min-width: 196px;
    position: relative;

    &.readonly {
        :deep(.ui-textbox) {
            cursor: pointer;
    
            input {
                cursor: pointer;
            }
        }
    }
}

</style>