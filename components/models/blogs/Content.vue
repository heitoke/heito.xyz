<template>
    <div :class="['content', { edit }]">
        <div class="row" v-for="(row, rowId) of content" :key="rowId"
            :style="{ '--columns': getRowColumns(row) }"
        >
            <div class="block list" v-for="(list, listId) of row" :key="listId"
                :style="{ 'grid-column': `${list?.size || 1} span` }"
            >
                <div class="row children" v-for="(children, childrenId) of list.childrens" :key="childrenId"
                    :style="{ '--columns': getRowColumns(children) }"
                >
                    <div class="block" v-for="(block, blockId) of children" :key="blockId"
                        :style="{
                            'grid-column': `${block?.size || 1} span`,
                            'align-self': `flex-${block?.bottom ? 'end' : 'start'}`,
                            'text-align': block?.right ? 'right' : 'left'
                        }"
                    >
                        <div class="image" v-for="image of block?.images" :key="image">
                            <img :src="image" alt="Image">

                            <ul class="buttons" v-if="edit">
                                <li class="blur" @mouseenter="toolpics.set({ text: 'Change image' })"
                                    @click="update(content => {
                                        const i = content[rowId][listId].childrens[childrenId][blockId]?.images?.findIndex(i => image === i);

                                        textWindow('Chnage image', 'image', 'Image (URL)', text => {
                                            content[rowId][listId].childrens[childrenId][blockId].images![i!] = text;
                                        });
                                    })"
                                >
                                    <Icon name="pencil"/>
                                </li>
                                <li class="blur" @mouseenter="toolpics.set({ text: 'Remove image' })"
                                    @click="update(content => {
                                        const i = content[rowId][listId].childrens[childrenId][blockId]?.images?.findIndex(i => image === i);

                                        content[rowId][listId].childrens[childrenId][blockId].images!.splice(i!, 1);
                                    })"
                                >
                                    <Icon name="close"/>
                                </li>
                            </ul>
                        </div>
                        
                        <Markdown :text="block.text" v-if="block.text && !edit"/>
                        <Textbox label="Text" :value="block.text" type="area" v-else-if="edit"
                            @input="(e: InputEvent) => update(content => {
                                content[rowId][listId].childrens[childrenId][blockId].text = (e.target as any).value;
                            })"
                        />

                        <Height :showed="edit">
                            <ul class="buttons">
                                <li v-for="btn of getBlockButtons" :key="btn.icon"
                                    @mouseenter="toolpics.set({ text: btn.label })"
                                    @click="btn?.click ? btn?.click(rowId, listId, childrenId, blockId) : null"
                                >
                                    <Icon :name="btn.icon"/>
                                </li>
                            </ul>
                        </Height>
                    </div>
                    
                    <ContentButtons
                        :style="`grid-row: 2; grid-column: ${getRowColumns(children)} span;`"
                        :edit="edit"
                        color="var(--green)"
                        :buttons="[
                            {
                                label: 'New block',
                                color: 'var(--yellow)',
                                click: () => update(content => {
                                    content[rowId][listId].childrens[childrenId] = [...content[rowId][listId].childrens[childrenId] || [], { size: 1 }];
                                })
                            },
                            {
                                label: 'Remove children',
                                color: 'var(--green)',
                                click: () => update(content => {
                                    content[rowId][listId].childrens.splice(childrenId, 1);
                                })
                            }
                        ]"
                    />
                </div>

                <ContentButtons
                    :edit="edit"
                    color="var(--blue)"
                    :buttons="[
                        {
                            label: 'New children',
                            color: 'var(--green)',
                            click: () => update(content => {
                                if (!content[rowId][listId]?.childrens) content[rowId][listId] = { size: 1, childrens: [] };

                                content[rowId][listId].childrens = [...content[rowId][listId].childrens || [], []];
                            })
                        },
                        {
                            label: 'Remove list',
                            color: 'var(--blue)',
                            click: () => update(content => {
                                content[rowId].splice(listId, 1);
                            })
                        }
                    ]"
                />
            </div>

            <ContentButtons
                :style="`grid-row: 2; grid-column: ${getRowColumns(row)} span;`"
                :edit="edit"
                :buttons="[
                    {
                        label: 'New list',
                        color: 'var(--blue)',
                        click: () => update(content => {
                            content[rowId].push({ size: 1, childrens: [] });
                        })
                    },
                    {
                        label: 'Remove row',
                        color: 'var(--main-color-alt)',
                        click: () => update(content => {
                            content.splice(rowId, 1);
                        })
                    }
                ]"
            />
        </div>

        <Height :showed="edit">
            <Button style="margin: 32px 0 0 0; padding: 24px 0;"
                @click="update(content => {
                    content.push([{ size: 1, childrens: [[{ size: 1 }]] }])
                })"
            >
                <span style="font-size: 20px; font-weight: 700;">New row</span>
            </Button>
        </Height>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import Markdown from '~/components/content/Markdown.vue';

import ContentButtons from './ContentButtons.vue';

import type { IBlogContent, IBlogContentChildren } from '~/types/api/blog';

type TContent = Array<Array<IBlogContent>>;

const emit = defineEmits(['update']);

const
    windows = useWindowsStore(),
    toolpics = useToolpicsStore();

const props = defineProps({
    content: { type: Object as PropType<TContent> },
    edit: { type: Boolean, default: false }
});

const error = ref<Array<string>>([]);

const getBlockButtons = computed(() => {
    return [
        {
            label: 'Add new image',
            icon: 'image',
            click: (rowId: number, listId: number, childrenId: number, blockId: number) => {
                update(content => {
                    textWindow('New image', 'image', 'Image (URL)', url => {
                        content[rowId][listId].childrens[childrenId][blockId].images = [...content[rowId][listId].childrens[childrenId][blockId].images || [], url];
                    });
                });
            }
        },
        {
            label: 'Change size',
            icon: 'layers',
            click: (rowId: number, listId: number, childrenId: number, blockId: number) => {
                update(content => {
                    textWindow('Change size', 'layers', 'Number', num => {
                        content[rowId][listId].childrens[childrenId][blockId].size = isNaN(Number(num)) ? 1 : Math.floor(Number(num) > 0 ? Number(num) : 1);
                    });
                });
            }
        },
        { 
            label: 'Remove block',
            icon: 'close',
            click: (rowId: number, listId: number, childrenId: number, blockId: number) => {
                update(content => {
                    content[rowId][listId].childrens[childrenId].splice(blockId, 1);
                });
            }
        },
        {
            label: 'Left',
            icon: 'arrow-left',
            click: (rowId: number, listId: number, childrenId: number, blockId: number) => {
                
            }
        },
        {
            label: 'Right',
            icon: 'arrow-right',
            click: (rowId: number, listId: number, childrenId: number, blockId: number) => {}
        }
    ]
});


function getRowColumns(row: Array<IBlogContent> | Array<IBlogContentChildren>) {
    let n = 0;

    for (let block of row) {
        n += block.size || 1;
    }

    return n;
}

function update(callback: (content: TContent) => void) {
    let content = [...props.content || []];

    callback(content as any);

    emit('update', content as any);
}

function textWindow(title: string, icon: string, label: string, callback: (text: string) => void) {
    let text = '';

    const { windowId } = windows.create({
        component: 'Message',
        data: {
            title,
            icon,
            components: [
                {
                    name: 'text',
                    component: 'Textbox',
                    props: { label },
                    events: {
                        input(e: InputEvent) {
                            text = (e.target as any).value;
                        }
                    }
                }
            ],
            buttons: [
                {
                    label: 'Change',
                    color: 'var(--green)',
                    click: () => {
                        callback(text);

                        windows.close(windowId);
                    }
                }
            ]
        }
    });
}

</script>

<style lang="scss" scoped>

.content {
    &.edit {
        .row, .block {
            margin: 12px 2px 8px 2px !important;
            padding: 8px 4px 0 0 !important;
            position: relative;
            border-radius: 0 5px;
            border: 1px solid var(--main-color-alt);
            border-bottom: none;
            border-left: none;

            &::after {
                content: attr(data-name);
                padding: 2px 8px;
                position: absolute;
                top: -16px;
                left: 8px;
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
                border-radius: 5px 5px 0 0;
                background-color: var(--main-color-alt);
                user-select: none;
            }
        }

        .row {
            margin-top: 24px;
            padding-top: 20px;

            &:after {
                content: "Row";
            }

            &:first-child {
                margin: 8px 2px;
            }

            &.children {
                border-color: var(--green);

                &:after {
                    content: "Children";
                    color: #000;
                    background-color: var(--green);
                }
            }
        }

        .block {
            border-color: var(--yellow);

            &:after {
                content: "Block";
                color: #000;
                background-color: var(--yellow);
            }

            &.list {
                border-color: var(--blue);

                &:after {
                    content: "List";
                    background-color: var(--blue);
                }
            }

            .row {
                margin-top: 20px;

                &:first-child {
                    margin-top: 12px;
                }
            }
        }
    }

    .row {
        display: grid;
        margin: 0 0 12px 0;
        min-height: 96px;
        grid-template-columns: repeat(var(--columns), calc(100% / var(--columns)));
        transition: .2s;

        &:last-child {
            margin: 0;
        }

        .block {
            margin: 0 12px 0 0;
            // background-color: var(--main-color-alt);
            transition: .2s;
            box-sizing: border-box;
            &:last-child {
                margin: 0;
            }

            .image {
                position: relative;

                ul.buttons {
                    margin: 0;
                    padding: 0;
                    position: absolute;
                    right: 12px;
                    bottom: 12px;
                    border: none;
                }
            }

            img {
                max-width: 100%;
                width: 100%;
            }

            .markdown-content {
                padding: 0 12px;
            }
        }
    }

    ul.buttons {
        display: flex;
        margin: 12px 0 0 0;
        padding: 12px 0 0 0;
        border-top: 1px solid var(--yellow);

        li {
            cursor: pointer;
            display: flex;
            margin: 0 8px 0 0;
            min-width: 32px;
            height: 32px;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            transition: .2s;

            &:last-child {
                margin: 0;
            }

            &:hover {
                i {
                    color: var(--text-primary);
                }
            }

            i {
                color: var(--text-secondary);
                transition: .2s;
            }
        }
    }
}

</style>