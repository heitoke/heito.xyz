<template>
    <div class="list">
        <header>
            <Image class="image"
                :src="list?.image || getAvatar({ nameId: list?._id, type: 'marble' })"
                :style="{ height: (list?.image ? 30 : 25) + 'vh' }"
            />

            <Text class="title" :text="list?.title || list?.name"/>

            <Text class="description" :text="list?.description"/>
        </header>

        <main>
            <div class="bar">
                <NavBar :menu="getListCategories"
                    :default-id="getListCategories.findIndex(category => category.value === $route.params.category)"
                    :orientation="$win.size.width < 740 ? 'horizontal' : 'vertical'"
                    @select="$router.push(`/lists/${route.params.name}/${$event.value}`)"
                />

                <Button v-if="user.getPer(EPermissions.Lists)"
                    :style="list?.categories?.length > 0 ? 'margin: 12px 0 0 0;' : ''"
                    @click="addNewCategory"
                >
                    Add category
                </Button>
            </div>

            <NuxtPage
                :list="list"
                :categories="getListCategories"
            />

            <Alert style="width: 100%" v-if="getListCategories.length < 1"/>
        </main>
    </div>
</template>

<script lang="ts" setup>

import NavBar, { type IButton } from '~/components/content/NavBar.vue';

import type { IList } from '~/types/api/lists';
import { EPermissions } from '~/types/api/user';

const { $api, $router } = useNuxtApp();

const route = useRoute();

const
    user = useUserStore(),
    windows = useWindowsStore();


const list = ref<IList>({} as IList);


const getListCategories = computed(() => {
    let buttons: Array<IButton> = [];

    for (let category of list.value?.categories || []) {
        buttons = [...buttons, {
            label: category.label || category.name,
            value: category.name
        }];
    }

    return buttons;
});

const { name, category } = route.params;

const [result, status] = await $api.lists.get(name as string);

if (status === 200) {
    list.value = result;

    const firstCategory = list.value.categories[0];

    if (process.client && firstCategory?.name && !category) {
        $router.push(`/lists/${name}/${firstCategory.name || ''}`);
    }

    // useSeoMeta(seo.createTemplate({
    //     title: `${getList.value?.title || getList.value?.name} | Lists`,
    //     description: getList.value?.description || '',
    //     image: getList.value?.image || ''
    // }));
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

async function addNewCategory() {
    const { title, name } = list.value;

    const body = { name: '', label: '' }

    const { windowId } = windows.create({
        component: 'Message',
        data: {
            title: `New category for ${title || name}`,
            icon: 'book',
            components: [
                textbox('Name', 'name', body),
                textbox('Label', 'label', body)
            ],
            buttons: [
                {
                    label: 'Add',
                    click: async () => {
                        const [result, status] = await $api.lists.update(name, {
                            categories: [
                                ...list.value?.categories || [],
                                body
                            ]
                        } as any);

                        if (status !== 200) return;

                        list.value.categories = [
                            ...list.value?.categories || [],
                            body as any
                        ];

                        windows.close(windowId);
                    }
                }
            ]
        }
    });
}


// definePageMeta({});

</script>

<style lang="scss" scoped>

.lists .list {
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

        :deep(.titles) {
            width: calc(100% - 215px - 12px);
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
            }
        }
    }
}

</style>