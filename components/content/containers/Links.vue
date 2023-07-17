<template>
    <div class="links" ref="root">
        <div class="filters" v-if="filters?.length > 0">
            <Textbox label="Search" v-show="filters.includes('search')"
                @input="filter.text = ($event.target as any)?.value"
            />

            <Button style="margin: 0 0 0 12px; width: 128px; white-space: nowrap;" v-show="filters.includes('add')"
                color="var(--green)"
                @click="addNewLink()"
            >
                New link
            </Button>
        </div>

        <ul>
            <li v-for="(link, idx) of getListLinks" :key="idx"
                @click="redirect(link?.url)"
                @contextmenu="linkContextMenu(idx)"
            >
                <Icon :name="link?.icon" :style="{ margin: '0 12px 0 0', color: link?.color }" v-if="link?.icon"/>

                <div :style="`max-width: calc(100% - ${link?.icon ? 32 : 0}px);`">
                    <div class="label">{{ link?.label }}</div>
                    <div class="text" v-show="link?.text">{{ link?.text }}</div>
                </div>
            </li>
        </ul>

        <div v-if="getListLinks.length < 1">
            <slot name="void" v-if="isSlotVoid"></slot>

            <Alert type="mini" v-else/>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import SelectIcon from '~/components/content/SelectIcon.vue';

import type { ILink } from '~/types/api/user';

import type { IMessage } from '~/windows/Message.vue';

const root = ref<HTMLElement | null>(null);

const emit = defineEmits(['add', 'update']);

const slots = defineSlots();

const
    contextMenu = useContextMenuStore(),
    windows = useWindowsStore();

const props = defineProps({
    links: {
        type: Object as PropType<Array<ILink>>,
        required: true
    },
    filters: {
        type: Object as PropType<Array<'add' | 'search'>>,
        default: () => {
            return ['add', 'search'];
        }
    }
});

const
    filter = ref({ text: '' }),
    list = ref<Array<ILink>>([]);


const getListLinks = computed(() => {
    const
        links = [...list.value || []],
        regex = new RegExp(filter.value.text.trim(), 'gi');

    return links.filter(({ label, text, url }) => regex.test(label) || regex.test(text || '') || regex.test(url));
});

const isSlotVoid = computed(() => {
    try {
        return (slots as any)?.void();
    } catch (err) {
        return false;
    }
});


watch(() => props.links, (newValue) => {
    list.value = newValue;
});


function addNewLink(link?: ILink, id: number = -1) {
    let newLink: ILink = {
        label: '',
        text: '',
        icon: '',
        img: '',
        color: '',
        url: ''
    };

    if (link) newLink = { ...link };
            
    windows.create({
        component: 'Message',
        data: {
            title: link?.label ? 'Changing the link' : 'Creating a new link',
            icon: 'link',
            text: link?.label ? 'Change the old link' : 'Create and share something new',
            components: [
                {
                    name: 'label',
                    component: 'Textbox',
                    props: { label: 'Label', value: newLink?.label },
                    events: {
                        input(e: MouseEvent) {
                            newLink['label'] = (e.target as any)?.value;
                        }
                    }
                },
                {
                    name: 'text',
                    component: 'Textbox',
                    props: { label: 'Text', value: newLink?.text },
                    events: {
                        input(e: MouseEvent) {
                            newLink['text'] = (e.target as any)?.value;
                        }
                    }
                },
                {
                    name: 'url',
                    component: 'Textbox',
                    props: { label: 'URL', value: newLink?.url },
                    events: {
                        input(e: MouseEvent) {
                            newLink['url'] = (e.target as any)?.value;
                        }
                    }
                },
                {
                    name: 'color',
                    component: 'ColorPicker',
                    props: { value: newLink?.color },
                    events: {
                        color(color: string) {
                            newLink['color'] = color;
                        }
                    }
                },
                {
                    component: SelectIcon,
                    props: { icon: newLink?.icon, color: newLink?.color },
                    events: {
                        select(iconName: string) {
                            console.log(iconName);
                            
                            newLink['icon'] = iconName;
                        }
                    }
                }
            ],
            buttons: [
                {
                    label: link?.label ? 'Update old' : 'To see something new',
                    color: `var(--${link?.label ? 'yellow' : 'green'})`,
                    click: (e: MouseEvent, data: any, windowId: number) => {
                        if (!newLink?.label || !newLink?.url) return;

                        if (id > -1) {
                            list.value[id] = newLink;
                        } else {
                            list.value = [...list.value || [], newLink];
                        }

                        windows.close(windowId);

                        emit('update', { list: list.value });
                    }
                }
            ]
        } as IMessage
    });
}

function linkContextMenu(idx: number) {
    const link = list.value[idx];

    contextMenu.create({
        name: `links:${link?.label}`,
        position: ['fixed', 'center', 'bottom'],
        event: root.value?.querySelector(`ul li:nth-child(${idx + 1})`)!,
        buttons: [
            {
                label: 'Change link',
                icon: 'pencil',
                click: () => {
                    addNewLink(link, idx);
                }
            },
            { separator: true } as any,
            {
                label: 'Delete link',
                icon: 'link',
                click: () => {
                    windows.create({
                        component: 'Message',
                        data: {
                            title: 'Deleting a link',
                            icon: 'link',
                            text: 'Do you really want to delete the link?',
                            buttons: [
                                {
                                    label: 'Out of sight',
                                    color: 'var(--red)',
                                    click: (e: MouseEvent, data: any, windowId: number) => {
                                        list.value = list.value.filter((_, i) => i !== idx);

                                        emit('update', { list: list.value });

                                        windows.close(windowId);
                                    }
                                },
                                {
                                    label: 'Give another chance',
                                    color: 'var(--green)',
                                    click: (e: MouseEvent, data: any, windowId: number) => {
                                        windows.close(windowId);
                                    }
                                }
                            ]
                        }
                    })
                }
            }
        ]
    })
}


onMounted(() => {
    list.value = props.links;

    emit('add', addNewLink);
});

</script>

<style lang="scss" scoped>

.links {
    .filters {
        display: flex;
        margin: 0 0 12px 0;
        align-items: center;
    }

    ul {
        display: grid;
        max-width: 100%;
        position: relative;
        grid-template-columns: repeat(2, 50%);

        li {
            cursor: pointer;
            display: flex;
            padding: 10px 16px;
            max-width: 100%;
            position: relative;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            box-sizing: border-box;
            align-items: center;
            transition: .2s;

            &:nth-child(1n) {
                margin: 12px 6px 0 0;
            }
            &:nth-child(2n) {
                margin: 12px 0 0 6px;
            }

            &:nth-child(1) {
                margin: 0 6px 0 0 !important;   
            }

            &:nth-child(2) {
                margin: 0 0 0 6px !important;   
            }

            &:hover {
                box-shadow: 0 0 5px 0 var(--background-secondary);
                transform: scale(1.02);
            }

            &:active {
                transform: scale(.95);
                opacity: .5;
            }

            .hx-icon {
                color: var(--text-secondary);
                transition: .2s;
            }

            .label,
            .text {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                box-sizing: border-box;
            }

            .text {
                color: var(--text-secondary);
                font-size: 12px;
            }
        }
    }
}

</style>