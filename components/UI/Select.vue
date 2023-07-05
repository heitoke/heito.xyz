<template>
    <div class="ui-select" ref="root">
        <header @click="open(text)">
            <Textbox :label="label" :icon="getItem?.icon" :value="getItem?.label" :watchValue="true" :readonly="readonly"
                @input="text = ($event.target as any)?.value; open(text); $emit('input', $event)"
            />
        </header>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

export interface IMenuButton {
    label: string;
    text: string;
    value: string;
    icon: string;
    color: string;
    img: string;
}

const root = ref<HTMLElement | null>(null);

const emit = defineEmits(['select']);

const props = defineProps({
    label: { type: String },
    value: { type: String },
    menu: { type: Object as PropType<Array<any>> }, // IContextMenuButton
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
    const buttonIndex = props.menu?.findIndex(btn => btn.value === (selected.value || props.value)) as number;

    return props.menu![buttonIndex] || {};
});

watch(() => props.menu?.length, () => {
    if (isOpen.value) open(text.value);
});


function open(text: string = '') {
    // this.closeContextMenu('ui-select');

    // const regex = new RegExp(text, 'g');

    // const sort = props.sort ? props.menu?.filter(x => regex.test(x.label) || regex.test(x?.value as any)) : props.menu;

    // isOpen.value = false;

    // this.setContextMenu({
    //     name: 'ui-select',
    //     position: [props.position, 'center', 'fixed-target'],
    //     event: root?.value,
    //     components: sort?.length! < 1 ? [
    //         {
    //             name: 'alert',
    //             component: 'Alert',
    //             props: {
    //                 type: 'mini'
    //             }
    //         }
    //     ] : [],
    //     buttons: sort?.length! < 1 ? [] : sort?.map(btn => {
    //         return {
    //             ...btn,
    //             click: (e: MouseEvent) => {
    //                 if (btn?.click) btn?.click(e);

    //                 selected.value = btn.value as string;

    //                 emit('select', getItem);

    //                 this.closeContextMenu('ui-select');

    //                 isOpen.value = false;
    //             }
    //         }
    //     })
    // }); // IContextMenu
}

</script>

<style lang="scss" scoped>

.ui-select {
    min-width: 196px;
    position: relative;

    // header {
    //     cursor: pointer;
    //     display: flex;
    //     padding: 8px 12px;
    //     max-width: 100%;
    //     width: 100%;
    //     position: relative;
    //     border-radius: 5px;
    //     border: 1px solid var(--background-secondary);
    //     box-sizing: border-box;
    //     transition: .2s;

    //     .label {
    //         position: absolute;
    //         top: 8px;
    //         color: var(--text-secondary);
    //         transition: .2s;
    //         user-select: none;
    //         z-index: 1;

    //         &.active {
    //             top: -10px;
    //             font-size: 12px;
    //             color: var(--text-primary);
    //         }
    //     }

    //     .label + div {
    //         display: flex;
    //         align-items: center;

    //         .hx-icon {
    //             margin: 0 8px 0 0;
    //         }

    //         .text {
    //             max-width: 100%;
    //             text-overflow: ellipsis;
    //             white-space: nowrap;
    //             overflow: hidden;
    //         }
    //     }
    // }
}

</style>