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
            :default-id="getListButtons.findIndex(list => list.value === $route.params.name) + 1"
            @select="$event?.value ? $router.push(`/lists/${$event.value}`) : null"
        />

        <NuxtPage/>
    </div>
</template>

<script lang="ts" setup>

import NavBar, { type IButton } from '~/components/content/NavBar.vue';

import type { IList } from '~/types/api/lists';
import { EPermissions } from '~/types/api/user';

const { $api } = useNuxtApp();

const route = useRoute();

const
    user = useUserStore(),
    windows = useWindowsStore();


const lists = ref<Array<IList>>([])


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



const [result, status] = await $api.lists.list();

if (status === 200) {
    lists.value = result.results;

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
        }
    });
}


definePageMeta({
    title: 'Lists',
    icon: 'book',
    index: 8
});

</script>

<style lang="scss" scoped>

.page.lists {
    padding: 92px 10% !important;
}

</style>