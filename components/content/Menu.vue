<template>
    <div class="menu">
        <Height :showed="getMenu?.index > 0" :opacity="true">
            <header @click="back">
                <Icon name="arrow-left"/>

                <div class="content">
                    <Text class="title" :text="getMenu?.title"/>
                    <Text class="text" :text="getMenu?.text"/>
                </div>
            </header>
        </Height>

        <ul>
            <li v-for="btn in getMenu?.buttons?.filter((btn: IContextMenuButton) => btn?.label || btn?.separator)" :key="btn.label"
                :class="{ separator: btn?.separator }"
                :style="{ '--button-color': btn?.color || 'var(--text-primary)' }"
                @click="buttonClick(btn, $event)"
            >
                <img :src="btn?.img" alt="ContextMenu Image" v-if="btn?.img">
                <Icon :name="btn?.icon" v-else-if="btn?.icon"/>

                <div class="content"
                    :style="{ 'max-width': `calc(100% - ${0 + (btn.children && (btn?.children?.buttons?.length! > 0) ? 24 : 0) + (btn?.icon ? 24 : 0) + (btn?.checkbox ? 32 : 0)}px)` }"
                >
                    <div>{{ btn.label }}</div>
                    <div v-show="btn?.text">{{ btn.text }}</div>
                </div>

                <Checkbox v-if="btn?.checkbox"
                    :value="Boolean(btn?.value)"
                    @onEvent="btn?.checkbox($event)"
                />

                <Icon class="arrow" name="arrow-right" v-if="btn?.children"/>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IContextMenu, IContextMenuButton, IContextMenuChildren } from '~/types/stores/contextMenu';

const emit = defineEmits(['children']);

const contextMenu = useContextMenuStore();

const props = defineProps({
    menu: { type: Object as PropType<IContextMenu> }
});

const
    mainName = ref<string>(''),
    children = ref<IContextMenuChildren>({} as IContextMenuChildren),
    history = ref<Array<IContextMenu>>([]);


const getMenu = computed(() => {
    const index: number = history.value.findIndex(c => c.name === children.value.name);

    return {
        ...children.value,
        index
    };
});


watch(() => props.menu, (newValue: IContextMenu, oldValue: IContextMenu) => {
    if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return;

    children.value = newValue;
    history.value = [newValue];
});


function buttonClick(btn: IContextMenuButton, e: Event) {
    if (btn.children) {
        history.value = [...history.value || [], btn.children];

        children.value = {
            title: btn?.label,
            text: btn?.text,
            color: btn?.color || 'var(--background-secondary)',
            ...btn.children
        };

        return emit('children', children.value);
    }
    
    if (btn?.click) btn.click(e);

    contextMenu.close();
}

function back() {
    const _children = history.value[getMenu.value?.index - 1];

    children.value = _children;

    emit('children', children);
}

onMounted(() => {
    mainName.value = props.menu?.name as string;

    children.value = props.menu!;

    history.value = [props.menu as IContextMenu];
});

</script>

<style lang="scss" scoped>

.button {
    &-enter-active,
    &-leave-active {
        position: absolute;
        transition: .2s;
        opacity: 0;
    }
}

.menu {
    header {
        cursor: pointer;
        display: flex;
        margin: 0 0 8px 0;
        padding: 4px 8px 8px 8px;
        border-bottom: 1px solid v-bind('getMenu?.color');
        align-items: center;

        &:hover {
            i.hx-icon {
                opacity: 1;
            }
        }

        i.hx-icon {
            margin: 0 8px 0 0;
            transition: .2s;
            opacity: .5;
        }

        .content {
            max-width: calc(100% - 16px);

            .title,
            .text {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .text {
                color: var(--text-secondary);
                font-size: 12px;
            }
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
                    opacity: 1;
                }
            }

            img {
                margin: 0 12px 0 0;
                min-width: 24px;
                height: 24px;
                border-radius: 50%;
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
                color: var(--button-color);
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
                margin: 0 0 0 12px;
                transition: .2s;
                opacity: .5;
            }
        }
    }
}

</style>