<template>
    <div class="titles">
        <div class="filters" v-if="categories?.length > 0 && titles.length > 0">
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

        <div class="grid" v-if="titles.length > 0 && !loading">
            <TransitionGroup name="titles">
                <Title v-for="(title, idx) of titles" :key="title._id"
                    :title="title"
                    :list-id="list.name"
                    :style="{ 'transition-delay': `${idx * .02}s` }"
                />
            </TransitionGroup>
        </div>

        <Loading v-else-if="loading"/>

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
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import Title from '~/components/models/lists/Title.vue';

import type { IButton } from '~/components/content/NavBar.vue';

import type { IList } from '~/types/api/lists';
import type { IListTitle } from '~/types/api/lists/title';
import { EPermissions } from '~/types/api/user';

const { $api } = useNuxtApp();

const route = useRoute();

const
    user = useUserStore(),
    windows = useWindowsStore();

const props = defineProps({
    list: {
        type: Object as PropType<IList>,
        required: true
    },
    categories: {
        type: Object as PropType<Array<IButton>>,
        required: true
    }
});

const
    loading = ref<boolean>(true),
    titles = ref<Array<IListTitle>>([]);


const { name, category } = route.params;

const [result, status] = await $api.lists.listTitles(name as string, category as string);

loading.value = false;

if (status === 200) {
    titles.value = result.results;

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

async function addNewTitle() {
    const { title, name } = props.list!;

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
                        menu: props.categories
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

                        if (body.category !== category) return;

                        titles.value = [
                            ...titles.value || [],
                            result
                        ];
                    }
                }
            ]
        }
    });
}


// definePageMeta({});

</script>

<style lang="scss" scoped>

.titles {
    &-enter-active,
    &-leave-active {
        transform: scale(.85);
        transition: all .2s;
        opacity: 0;
    }

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

    @media (max-width: 540px) {
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

</style>