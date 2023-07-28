<template>
    <div class="list-title">
        <Image class="image" :src="title.image || ''"/>

        <main>
            <Text class="title" :text="title.title || title.name"/>

            <Text class="description" :text="title.description || ''"/>
        </main>
    </div>
</template>

<script lang="ts" setup>

import type { PropType } from 'nuxt/dist/app/compat/capi';

import type { Item, ItemButton } from '~/types/stores/contextMenu';
import type { IList } from '~/types/api/lists';
import type { IListTitle } from '~/types/api/lists/title';
import { EPermissions } from '~/types/api/user';

interface Data {
    listId: string;
    titleId: string;
}

const { $api } = useNuxtApp();

const
    user = useUserStore(),
    contextMenu = useContextMenuStore(),
    windows = useWindowsStore();

const props = defineProps({
    windowId: { type: Number },
    data: { type: Object as PropType<Data> }
});

const
    list = ref<IList>({} as IList),
    title = ref<IListTitle>({} as IListTitle),
    changes = ref<IListTitle>({} as IListTitle);



const isAdmin = computed(() => {
    return user.getPer(EPermissions.Lists);
});

async function loadList(listId: string) {
    const [result, status] = await $api.lists.get(listId);

    if (status !== 200) return;

    list.value = result;
}

async function loadTitle(listId: string, titleId: string) {
    const [result, status] = await $api.lists.getTitle(listId, titleId);

    if (status !== 200) return;

    title.value = result;

    setButtons();
}


function textboxWindow(title: string, label: string, icon: string, type: 'input' | 'area' = 'input'): ItemButton {
    let content = '';

    return {
        type: 'button',
        label,
        icon,
        click: () => windows.create({
            component: 'Message',
            data: {
                title,
                icon,
                components: [
                    {
                        name: 'text',
                        component: 'Textbox',
                        props: { label, type },
                        events: {
                            input(event: InputEvent) {
                                content = (event.target as any).value;
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        label: 'Change',
                        click: () => {}
                    }
                ]
            }
        })
    }
}

function buttonImage(): Item {
    const button: Item = {
        type: 'button',
        label: 'Image',
        icon: 'image'
    };

    if (title.value.image) {
        button.children = {
            name: 'window:lists:title:settings:image',
            items: [
                textboxWindow('Change title image', 'Change', 'pencil'),
                {
                    type: 'button',
                    label: 'Remove',
                    icon: 'close',
                    click: () => {
                        changes.value.image = '';
                    }
                }
            ]
        }
    } else {
        button.click = textboxWindow('New title image', 'Image (URL)', 'image').click
    }

    return button;
}

function buttonCategory(): Item {
    let content = '';

    return {
        type: 'button',
        label: 'Category',
        click: () => windows.create({
            component: 'Message',
            data: {
                title: 'Change category',
                // icon: '',
                components: [
                    {
                        name: 'select',
                        component: 'Select',
                        props: {
                            label: 'New category',
                            menu: list.value.categories.map(category => ({
                                label: category.label,
                                value: category.name
                            }))
                        },
                        events: {
                            select({ value }) {
                                content = value;
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        label: 'Change',
                        click: () => {
                            changes.value.category = content;
                        }
                    }
                ]
            }
        })
    }
}

function buttonTitleSettings(): Item {
    return {
        type: 'button',
        label: 'Settings',
        icon: 'settings',
        children: {
            name: 'window:lists:title:settings',
            items: [
                buttonImage(),

                { type: 'separator' },

                textboxWindow('Change title name', 'Name', 'username'),
                textboxWindow('Change title', 'Title', 'text-a'),
                textboxWindow('Change title description', 'Description', 'text-align-left', 'area'),

                { type: 'separator' },

                buttonCategory(),

                { type: 'separator' },

                {
                    type: 'button',
                    label: 'Delete',
                    icon: 'trash',
                    color: 'var(--red)'
                }
            ]
        }
    }
}

function setButtons() {
    const contextMenuTitleSettings = (event: Event) => {
        const items: Array<Item> = isAdmin.value ? [buttonTitleSettings(), { type: 'separator' }] : [];

        contextMenu.create({
            name: 'window:lists:title:options',
            position: ['left', 'center', 'fixed'],
            event,
            items: [
                ...items,
                {
                    type: 'button',
                    label: 'Copy ListId',
                    icon: 'book',
                    click: () => {
                        copy(list.value._id);
                    }
                },
                {
                    type: 'button',
                    label: 'Copy TitleId',
                    icon: 'image',
                    click: () => {
                        copy(title.value._id);
                    }
                }
            ]
        });
    }

    windows.setButtons(props.windowId!, [
        {
            label: 'Settings',
            icon: 'ellipsis',
            click: contextMenuTitleSettings
        }
    ]);
}



onMounted(() => {
    if (!props.data?.listId || !props.data?.titleId) return;

    loadList(props.data.listId);

    loadTitle(props.data.listId, props.data.titleId);
});

</script>

<style lang="scss" scoped>

.block.list-title {
    display: flex;

    .image {
        margin: 0 12px 0 0;
        padding: 0 0 calc(80%) 0;
        min-width: 215px;
        height: 0;
        border-radius: 5px;
    }

    main {
        width: 376px;

        .title {
            font-size: max(calc(var(--font) - 30vmin), 24px);
        }
    }
}

</style>