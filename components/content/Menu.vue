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
            <template v-for="(item, idx) of getMenu?.items || []" :key="idx"
                :class="[item.type]"
            >
                <li v-if="item.type === 'separator'"
                    :class="item.type"
                    :style="{
                        margin: item?.margin || '8px 0',
                        'border-color': item?.color || 'var(--background-secondary)'
                    }"
                ></li>

                <li v-else-if="item.type === 'button'"
                    :class="item.type"
                    :style="{ '--button-color': item?.color || 'var(--text-primary)' }"
                    @click="clickButton(item, $event)"
                >
                    <img :src="item?.img" alt="ContextMenu ItemButton Image" v-if="item?.img">
                    <Icon :name="item?.icon" v-else-if="item?.icon"/>

                    <div class="content"
                    :style="{
                        'max-width': `calc(100% - ${0 + (item?.children && (item?.children?.items?.length! > 0) ? 24 : 0) + (item?.icon ? 24 : 0) + (item?.checkbox ? 32 : 0)}px)`
                    }"
                    >
                        <div>{{ item.label }}</div>
                        <div>{{ item?.text || '' }}</div>
                    </div>

                    <Checkbox v-if="item?.checkbox"
                        :value="Boolean(item?.value)"
                        @onEvent="item?.checkbox($event)"
                    />

                    <Icon class="arrow" name="arrow-right" v-if="item?.children?.name"/>
                </li>

                <li v-else-if="item.type === 'component'" :class="item.type">
                    <component :is="item.component"
                        :style="item?.style || ''"
                        v-bind="item.props"
                        v-on="Object.keys(item?.events || {}).length > 0 ? item?.events : {}"
                    >
                        <!-- <template v-for="slot of Object.keys(item?.slots || {}) || []" v-slot:slot="{slot}"></template> -->
                    </component>
                </li>
            </template>

            <!-- <li v-for="btn in getMenu?.buttons?.filter((btn: IContextMenuButton) => btn?.label || btn?.separator)" :key="btn.label"
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
            </li> -->

            <!-- <div class="components" v-if="contextMenu.getMenu?.components?.length! > 0">
                    <component v-for="component of contextMenu.getMenu?.components" :is="component.component"
                        :style="component?.style || ''"
                        v-bind="component.props"
                        v-on="Object.keys(component?.events || {}).length > 0 ? component?.events : null"
                    >
                        <div v-html="component?.slot || ''"></div>
                    </component>
                </div> -->
        </ul>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IContextMenu, Item, ItemButton, ItemChildren } from '~/types/stores/contextMenu';

const emit = defineEmits(['children']);

const contextMenu = useContextMenuStore();

const props = defineProps({
    menu: {
        type: Object as PropType<IContextMenu>,
        required: true
    }
});

const
    mainName = ref<string>(''),
    children = ref<ItemChildren>({} as ItemChildren),
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


function clickButton(btn: ItemButton, event: Event) {
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
    
    if (btn?.click) btn.click(event);

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
        li.separator {
            padding: 0;
            width: 100%;
            border-top: 1px solid var(--background-secondary);
        }

        li.button {
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