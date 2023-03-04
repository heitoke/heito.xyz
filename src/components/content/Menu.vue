<template>
    <div class="menu">
        <header v-show="getMenu?.index > 0" @click="name = childrens[getMenu?.index - 1].name">
            <Icon name="arrow-left"/>
            <Text class="title" :text="getMenu?.title"/>
        </header>
        <ul>
            <TransitionGroup name="button">
                <li v-for="btn in getMenu?.buttons" :key="btn"
                    :class="{ separator: btn?.separator }"
                    :style="{ '--button-color': btn?.color || 'var(--text-primary)' }"
                    @click="buttonClick(btn, $event)"
                >
                    <Icon :name="btn?.icon" v-if="btn?.icon"/>

                    <div class="content"
                        :style="{ 'max-width': `calc(100% - ${0 + (btn.children && (btn?.children?.buttons?.length > 0) ? 24 : 0) + (btn?.icon ? 24 : 0) + (btn?.checkbox ? 32 : 0)}px)` }"
                    >
                        <div>{{ btn.label }}</div>
                        <div v-show="btn?.text">{{ btn.text }}</div>
                    </div>

                    <Checkbox :value="btn?.value" @onEvent="btn?.checkbox($event)" v-if="btn?.checkbox"/>

                    <Icon class="arrow" name="arrow-right" v-if="btn?.children"/>
                </li>
            </TransitionGroup>
        </ul>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import type { IContextMenu, IContextMenuButton, TPosition } from '../../store/modules/contextMenu';

interface IData {
    name: string;
    childrens: IContextMenu[];
}

export default defineComponent({
    name: 'Menu',
    computed: {
        getMenu(): IContextMenu | any {
            let menuIndex: number = this.childrens.findIndex(c => c.name === this.name);
            return { ...this.childrens[menuIndex], index: menuIndex };
        }
    },
    props: {
        menu: {
            type: Object as PropType<IContextMenu>
        }
    },
    data(): IData {
        return {
            name: '',
            childrens: []
        }
    },
    watch: {
        menu(newValue: IContextMenu, oldValue: IContextMenu) {
            if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return;

            this.name = newValue?.name as string;
            this.childrens = [newValue];
        }
    },
    methods: {
        buttonClick(btn: IContextMenuButton, e: Event) {
            if (btn.children) {
                this.childrens = [...this.childrens, btn.children];
                this.name = btn.children.name;
            } else if (btn.click) btn.click(e);
        }
    },
    mounted() {
        this.name = this.menu?.name as string;
        this.childrens = [this.menu as IContextMenu];
    }
})

</script>

<style lang="scss" scoped>

.button {
    &-enter-active,
    &-leave-active {
        height: 0px;
        transform: rotateX(90deg);
        transition: .2s;
        opacity: 0;
    }
}

.menu {
    header {
        cursor: pointer;
        display: flex;
        margin: 0 0 8px 0;
        padding: 8px;
        border-bottom: 1px solid var(--background-secondary);

        &:hover {
            i.hx-icon {
                --color: var(--text-primary);
            }
        }

        i.hx-icon {
            --color: var(--text-secondary);
            margin: 0 8px 0 0;
            transition: .2s;
        }

        .title {
            max-width: calc(100% - 12px);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    ul {
        li {
            cursor: pointer;
            display: flex;
            padding: 8px 12px;
            position: relative;
            max-width: 100%;
            border-radius: 5px;
            align-items: center;
            transition: .2s;
            overflow: hidden;

            &::after {
                content: " ";
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: var(--background-primary);
                transition: .2s;
                opacity: 0;
                z-index: -1;
            }

            &:hover {
                &::after {
                    opacity: .5;
                }

                .arrow {
                    --color: var(--text-primary);
                }
            }

            &.separator {
                margin: 8px 0;
                padding: 0;
                width: 100%;
                border-top: 1px solid var(--background-secondary);

                *, &::after {
                    content: " ";
                    display: none;
                }
            }

            i.hx-icon:not(.arrow) {
                --color: var(--button-color);
                margin: 0 12px 0 0;
            }

            .content {
                width: 100%;
                
                div {
                    max-width: 100%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;

                    &:nth-child(2) {
                        color: var(--text-secondary);
                        font-size: 12px;
                    }
                }
            }

            .arrow {
                --color: var(--text-secondary);
                margin: 0 0 0 12px;
                transition: .2s;
            }
        }
    }
}

</style>