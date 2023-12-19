<template>
    <div class="menu">
        <ul>
            <li v-for="(item, idx) of items" :key="idx"
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
                    <Checkbox :value="true"/>
                </template>

                <template v-if="item.type === 'children'">
                    <Icon name="arrow-right"/>
                </template>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import type { Item } from '~/types/stores/contextMenu';


const props = defineProps<{
    items: Array<Item>;
}>();


function onClick(idx: number, $event: MouseEvent) {
    const item = props.items[idx];
    
    if (!item) return;

    console.log(item);
    
}

</script>

<style lang="scss" scoped>

.menu {
    user-select: none;

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
                    width: 100%;
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