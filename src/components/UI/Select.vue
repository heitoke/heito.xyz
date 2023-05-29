<template>
    <div class="ui-select">
        <header @click="open">
            <div :class="['label', { active: getItem?.label || isActive }]">{{ label }}</div>
            <div>
                <Icon :name="getItem?.icon" :style="{ color: getItem?.color || 'var(--text-secondary)' }" v-if="getItem?.icon"/>
                <Text class="text
                " :text="getItem?.label || ''" style="height: 18px;"/>
            </div>
        </header>
    </div>
</template>

<script lang="ts" setup>

import { mapActions } from 'vuex';
import { type IContextMenuButton } from '../../store/modules/contextMenu';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

export interface IMenuButton {
    label: string;
    text: string;
    value: string;
    icon: string;
    color: string;
}

export default defineComponent({
    name: 'UISelect',
    computed: {
        getItem() {
            let buttonIndex = this.menu?.findIndex(btn => btn.value === (this.selected || this.value)) as number;
            return this.menu![buttonIndex] || {};
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
        }
    },
    data: () => ({
        isActive: false,
        selected: ''
    }),
    watch: {},
    methods: {
        ...mapActions(['setContextMenu', 'closeContextMenu']),
        open(event: MouseEvent) {
            this.isActive = !this.isActive;

            this.setContextMenu({
                name: 'ui-select',
                position: [this.position, 'center', 'fixed-target'],
                event: this.$el,
                buttons: this.menu?.map(btn => {
                    return {
                        ...btn,
                        click: (e: MouseEvent) => {
                            if (btn?.click) btn?.click(e);

                            this.selected = btn.value as string;

                            this.$emit('select', this.getItem);

                            this.isActive = false;
                            this.closeContextMenu('ui-select');
                        }
                    }
                })
            });
        },
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.ui-select {
    min-width: 196px;
    position: relative;

    header {
        cursor: pointer;
        display: flex;
        padding: 8px 12px;
        max-width: 100%;
        width: 100%;
        position: relative;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        box-sizing: border-box;
        transition: .2s;

        .label {
            position: absolute;
            top: 8px;
            color: var(--text-secondary);
            transition: .2s;
            user-select: none;
            z-index: 1;

            &.active {
                top: -10px;
                font-size: 12px;
                color: var(--text-primary);
            }
        }

        .label + div {
            display: flex;
            align-items: center;

            .hx-icon {
                margin: 0 8px 0 0;
            }

            .text {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }

    .list {
        width: 100%;
        position: absolute;
        top: calc(100% + 8px);
        left: 0px;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        transition: .2s;
    }
}

</style>