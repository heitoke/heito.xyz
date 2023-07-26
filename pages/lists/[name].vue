<template>
    <div class="lists">
        <NavBar
            :menu="[
                ...(user.getPer(EPermissions.Lists) ? [
                    {
                        label: 'Create new list',
                        icon: 'book',
                        click: createNewList
                    }
                ] : [] as any),
                ...getListButtons
            ]"
            :default-id="0"
            @select="$event?.value ? $router.push(`/lists/${$event.value}`) : null"
        />

        <header>
            <Image class="image"
                :src="getList?.image || getAvatar({ nameId: getList?._id, type: 'marble' })"
                :style="{ height: (getList?.image ? 30 : 25) + 'vh' }"
            />

            <Text class="title" :text="getList?.title || getList?.name"/>

            <Text class="description" :text="getList?.description"/>
        </header>

        <main>
            <div class="bar">
                <NavBar :menu="getListCategories"
                    :default-id="0"
                    :orientation="$win.size.width < 740 ? 'horizontal' : 'vertical'"
                    @select="getListTitles(getList.name, $event.value)"
                />

                <Button v-if="user.getPer(EPermissions.Lists)"
                    :style="getList.categories.length > 0 ? 'margin: 12px 0 0 0;' : ''"
                    @click="addNewCategory"
                >
                    Add category
                </Button>
            </div>

            <div class="titles">
                <div class="filters" v-if="getList.categories.length > 0 && titles.list.length > 0">
                    <Textbox label="Search titles"/>

                    <Select label="Sort"
                        :menu="[]"
                    />

                    <Button v-if="user.getPer(EPermissions.Lists)"
                        @click="addNewTitle"
                    >
                        Add title
                    </Button>
                </div>

                <div class="grid" v-if="titles.list.length > 0 && !titles.loading">
                    <TransitionGroup name="titles">
                        <Title v-for="(title, idx) of titles.list" :key="title._id"
                            :title="title"
                            :style="{ 'transition-delay': `${idx * .02}s` }"
                        />
                    </TransitionGroup>
                </div>

                <Loading v-else-if="titles.loading"/>

                <Alert v-else>
                    <div style="font-size: 18px;">The category of this list is currently empty</div>

                    <Button v-if="user.getPer(EPermissions.Lists)"
                        style="margin: 12px 0 0 0; min-width: 128px; width: max-content;" 
                        @click="addNewTitle"
                    >
                        Add title
                    </Button>
                </Alert>
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>

import NavBar, { type IButton } from '~/components/content/NavBar.vue';

import Title from '~/components/models/lists/Title.vue';

import type { IMessage } from 'windows/Message.vue';
import type { IList } from '~/types/api/lists';
import type { IListTitle } from '~/types/api/lists/title';
import { listPermissions, EPermissions } from '~/types/api/user';

const { $api, $win } = useNuxtApp();

const route = useRoute();

const
    user = useUserStore(),
    windows = useWindowsStore(),
    toolpics = useToolpicsStore();


const
    lists = ref<Array<IList>>([]),
    loading = ref<boolean>(),
    name = ref<string>(''),
    category = ref<string>(''),
    titles = ref<{ list: Array<IListTitle>, loading: boolean }>({
        list: [],
        loading: false
    });


const getListButtons = computed(() => {
    let buttons: Array<IButton> = [];

    for (let list of lists.value) {
        buttons = [...buttons, {
            label: list.title || list.name,
            value: list.name
        }];
    }

    return buttons;
});

const getList = computed<IList>(() => {
    const list = lists.value.find(list => list.name === name.value);

    return list!;
});

const getListCategories = computed(() => {
    let buttons: Array<IButton> = [];

    for (let category of getList.value?.categories || []) {
        buttons = [...buttons, {
            label: category.label || category.name,
            value: category.name
        }];
    }

    return buttons;
});



const [result, status] = await $api.lists.list();

if (status === 200) {
    lists.value = result.results;

    const list = lists.value.find(list => list.name === route.params.name);

    name.value = list?.name || result.results[0].name;

    if (process.client) {
        getListTitles(name.value, getList.value?.categories[0]?.name || '');
    }

    // useSeoMeta(seo.createTemplate({
    //     title: `${getList.value?.title || getList.value?.name} | Lists`,
    //     description: getList.value?.description || '',
    //     image: getList.value?.image || ''
    // }));
}


async function getListTitles(listId: string, categoryList: string) {
    titles.value.loading = true;

    const [result, status] = await $api.lists.listTitles(listId, categoryList);

    titles.value.loading = false;

    if (status !== 200) return;

    category.value = categoryList;

    titles.value.list = result.results;
}

const textbox = (label: string, name: string, body: any, type: 'input' | 'area' = 'input') => ({
    name,
    component: 'Textbox',
    props: { label, type },
    events: {
        input(event: InputEvent) {
            body[name] = (event.target as any).value;
        }
    }
});

async function createNewList() {
    const body = {
        name: '',
        title: '',
        description: '',
        image: ''
    }

    const { windowId } = windows.create({
        component: 'Message',
        data: {
            title: `Create new list`,
            icon: 'book',
            components: [
                textbox('Name', 'name', body),
                textbox('Title', 'title', body),
                // textbox('Description', 'description', body, 'area'),
                // textbox('Image (URL)', 'image', body)
            ],
            buttons: [
                {
                    label: 'Create',
                    click: async () => {
                        const [result, status] = await $api.lists.create(body);

                        if (status !== 200) return;

                        lists.value = [
                            ...lists.value,
                            result
                        ];

                        windows.close(windowId);
                    }
                }
            ]
        } as IMessage
    });
}

async function addNewCategory() {
    const { title, name } = getList.value;

    const body = {
        name: '',
        label: ''
    }

    const { windowId } = windows.create({
        component: 'Message',
        data: {
            title: `New category for ${title || name}`,
            icon: 'book',
            components: [
                {
                    name: 'name',
                    component: 'Textbox',
                    props: { label: 'Name' },
                    events: {
                        input(event: InputEvent) {
                            body.name = (event.target as any).value;
                        }
                    }
                },
                {
                    name: 'label',
                    component: 'Textbox',
                    props: { label: 'Label', value: body.name },
                    events: {
                        input(event: InputEvent) {
                            body.label = (event.target as any).value;
                        }
                    }
                }
            ],
            buttons: [
                {
                    label: 'Add',
                    click: async () => {
                        const [result, status] = await $api.lists.update(name, {
                            categories: [
                                ...getList.value.categories,
                                body
                            ]
                        } as any);

                        if (status !== 200) return;

                        const index = lists.value.findIndex(list => list.name === getList.value.name);

                        lists.value[index].categories = [
                            ...lists.value[index].categories,
                            body as any
                        ];

                        windows.close(windowId);
                    }
                }
            ]
        } as IMessage
    });
}

async function addNewTitle() {
    const { title, name } = getList.value;

    const body = {
        name: '',
        title: '',
        description: '',
        image: '',
        category: ''
    }

    const { windowId } =  windows.create({
        component: 'Message',
        data: {
            title: `New title for ${title || name}`,
            icon: 'image',
            components: [
                textbox('Name', 'name', body),
                textbox('Title', 'title', body),
                {
                    name: 'category',
                    component: 'Select',
                    props: {
                        label: 'Category',
                        menu: getListCategories.value
                    },
                    events: {
                        select(event: IButton) {
                            body.category = event.value!;
                        }
                    }
                },
                textbox('Description', 'description', body, 'area'),
                textbox('Image (URL)', 'image', body)
            ],
            buttons: [
                {
                    label: 'Add',
                    click: async () => {
                        const [result, status] = await $api.lists.createTitle(name, body);

                        if (status !== 200) return;

                        windows.close(windowId);

                        if (body.category !== category.value) return;

                        titles.value.list = [
                            ...titles.value.list,
                            result
                        ];
                    }
                }
            ]
        } as IMessage
    });
}


definePageMeta({
    title: 'Lists',
    icon: 'book',
    path: '/lists/:name?',
    alias: [
        '/list/:name?'
    ],
    index: 8,
    mainPage: '/lists'
});

</script>

<style lang="scss" scoped>

.titles-enter-active,
            .titles-leave-active {
                transform: scale(.85);
                transition: all .2s;
                opacity: 0;
            }

.page.lists {
    padding: 92px 10% !important;

    header {
        margin: 24px 0;
        padding: 0 0 24px 0;
        border-bottom: 3px solid var(--background-secondary);

        .image {
            width: 100%;
            border-radius: 15px;
        }

        .title {
            margin: 12px 0;
            font-size: max(calc(var(--font) - 3.5vmin), 24px);
        }

        .description {
            color: var(--text-secondary);
            font-size: 16px;
        }
    }

    main {
        display: flex;
        align-items: flex-start;

        .bar {
            margin: 0 12px 0 0;
            max-width: 215px;
            min-width: 215px;
        }

        .titles {
            width: calc(100% - 215px - 12px);

            .filters {
                display: flex;
                margin: 0 0 12px 0;
                align-items: center;

                .ui-select {
                    margin: 0 12px;
                }

                .ui-button {
                    width: max-content;
                    min-width: 128px;
                }
            }

            .grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 12px;
            }
        }
    }

    @media (max-width: 540px) {
        main {
            display: block;

            .bar {
                margin: 0;
                max-width: 100%;
                max-width: auto !important;
                min-width: auto !important;
            }

            .titles {
                width: 100%;

                .filters {
                    display: block;
                    margin: 12px 0;

                    .ui-select {
                        margin: 8px 0;
                    }

                    .ui-button {
                        width: 100%;
                    }
                }

                .grid {
                    grid-template-columns: 1fr 1fr;
                }
            }
        }
    }
}

</style>