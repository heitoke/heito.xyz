<template>
    <div class="ui-select">
        <header @click="open(text)">
            <Textbox :label="label" :icon="getItem?.icon" :value="getItem?.label" :watchValue="true" :readonly="readonly"
                @input="text = ($event.target as any)?.value; open(text); $emit('input', $event)"
            />
        </header>
    </div>
</template>

<script lang="ts" setup>

import { mapActions } from 'vuex';
import type { IContextMenu, IContextMenuButton } from '../../store/modules/contextMenu';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

export interface IMenuButton {
    label: string;
    text: string;
    value: string;
    icon: string;
    color: string;
    img: string;
}

export default defineComponent({
    name: 'UISelect',
    computed: {
        getItem() {
            let buttonIndex = this.menu?.findIndex(btn => btn.value === (this.selected || this.value)) as number;
            return this.menu![buttonIndex] || {};
        },
        getLengthMenu() {
            return this.menu?.length;
        }
    },
    props: {
        label: {
            type: String
        },
        value: {
            type: String
        },
        menu: {
            type: Object as PropType<Array<IContextMenuButton>>
        },
        position: {
            type: String as PropType<'bottom' | 'top'>,
            default: 'bottom'
        },
        search: {
            type: Boolean,
            default: true
        },
        sort: {
            type: Boolean,
            default: true
        },
        readonly: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        selected: '',
        text: '',
        isOpen: false
    }),
    watch: {
        'getLengthMenu'(newValue, oldValue) {
            if (this.isOpen) this.open(this.text);
        }
    },
    methods: {
        ...mapActions(['setContextMenu', 'closeContextMenu']),
        open(text: string = '') {
            this.closeContextMenu('ui-select');

            const regex = new RegExp(text, 'g');

            const sort = this.sort ? this.menu?.filter(x => regex.test(x.label) || regex.test(x?.value as any)) : this.menu;
            
            this.isOpen = false;

            this.setContextMenu({
                name: 'ui-select',
                position: [this.position, 'center', 'fixed-target'],
                event: this.$el,
                components: sort?.length! < 1 ? [
                    {
                        name: 'alert',
                        component: 'Alert',
                        props: {
                            type: 'mini'
                        }
                    }
                ] : [],
                buttons: sort?.length! < 1 ? [] : sort?.map(btn => {
                    return {
                        ...btn,
                        click: (e: MouseEvent) => {
                            if (btn?.click) btn?.click(e);

                            this.selected = btn.value as string;

                            this.$emit('select', this.getItem);

                            this.closeContextMenu('ui-select');

                            this.isOpen = false;
                        }
                    }
                })
            } as IContextMenu);
        },
    },
    mounted() {}
});

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