<template>
    <div class="menu" ref="root">
        <Height :show="Boolean(getCurrentChildren)">
            <header
                @click="goToBack"
            >
                <Icon name="arrow-left"/>

                <div>
                    <div>{{ getCurrentChildren?.label }}</div>

                    <div>{{ getCurrentChildren?.text }}</div>
                </div>
            </header>
        </Height>
        
        <ul>
            <li v-for="(item, idx) of getItems" :key="idx"
                :class="[item.type]"

                @click="item.type !== 'separator' ? onClick(idx, $event) : null"
            >
                <template v-if="item.type !== 'separator'">
                    <template v-if="item?.icon">
                        <Icon :name="item.icon" :style="`color: ${item?.color || 'var(--text-secondary)'}`"/>
                    </template>

                    <template v-if="item?.image">
                        <img :src="item.image" width="24px" height="24px"
                            style="object-fit: cover; object-position: center; margin-right: 8px; border-radius: 5px;"
                        >
                    </template>

                    <div class="content">
                        <div>{{ item.label }}</div>
    
                        <div>{{ item.text }}</div>
                    </div>
                </template>

                <template v-if="item.type === 'checkbox'">
                    <Checkbox
                        :disabled="'only-click'"
                        :name="item?.name"
                        :value="(typeof item?.value) === 'boolean' ? item?.value : (item?.value as Ref)?.value"
                    />
                </template>

                <template v-if="item.type === 'radio'">
                    <Radio
                        :name="item?.name"
                        :value="item.value"
                        :checked="item?.ref === item.value"
                    />
                </template>

                <template v-if="item.type === 'children'">
                    <Icon name="arrow-right"/>
                </template>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import type { Item, ItemChildren } from '~/types/stores/contextMenu';


const root = ref<HTMLElement | null>(null);


const props = defineProps<{
    items: Array<Item>;
}>();


const childrens = ref<Array<ItemChildren>>([]);


const getCurrentChildren = computed<ItemChildren | null>(() => {
    if (!childrens.value.length) return null;

    return childrens.value[childrens.value.length - 1];
});

const getItems = computed(() => {
    if (!getCurrentChildren.value) return props.items;

    return getCurrentChildren.value.items;
});


function onClick(idx: number, event: MouseEvent) {
    const item = getItems.value[idx];
    
    if (!item) return;

    switch(item.type) {
        case 'button':
            if (item?.click) item.click(event);
            break;

        case 'children':
            childrens.value.push(item as any);
            break;

        case 'checkbox':
            if (item?.click) {
                item.click(!(typeof item.value === 'string' ? item.value : (item.value as Ref<boolean>).value), event);
            }
            break;

        case 'radio':
            if (item?.click) item.click(item.value!, event);
            break;
    }
}

function goToBack() {
    childrens.value.splice(childrens.value.length - 1, 1);
}

</script>

<style lang="scss" scoped>

.menu {
    user-select: none;

    header {
        cursor: pointer;
        display: flex;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--background-secondary);
        align-items: center;

        &:hover {
            .ui-icon {
                opacity: 1;
            }
        }

        .ui-icon {
            margin-right: 8px;
            opacity: .5;
        }

        .ui-icon + div {
            max-width: 100%;
            min-width: 0;
            flex: 1;

            div {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;

                &:nth-child(1) {
                    font-size: 14px;
                }

                &:nth-child(2) {
                    color: var(--text-secondary);
                    font-size: 12px;
                }
            }
        }
    }

    ul {
        li {
            &:not(.separator) {
                cursor: pointer;
                display: flex;
                padding: 8px;
                max-width: 100%;
                position: relative;
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
                    background-color: var(--text-primary);
                    transition: .2s;
                    opacity: 0;
                    z-index: -1;
                }

                &:hover {
                    &::after {
                        opacity: .1;
                    }
                }

                .ui-icon {
                    & + .content {
                        margin-left: 8px;
                    }
                }

                .content {
                    max-width: 100%;
                    min-width: 0;
                    flex: 1;
                    
                    div {
                        max-width: 100%;
                        font-size: 14px;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        flex: 1;

                        &:nth-child(2) {
                            color: var(--text-secondary);
                            font-size: 12px;
                        }
                    }
                }
            }

            &.separator {
                margin: 8px 0;
                border-top: 1px solid var(--background-secondary);
            }

            &.children {
                &:not(:hover) {
                    .ui-icon.i-arrow-right {
                        opacity: .5;
                    }
                }
            }
        }
    }
}

</style>