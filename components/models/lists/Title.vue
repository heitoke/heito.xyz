<template>
    <div class="list-title"
        @click="openWindow"
    >
        <Image :src="title?.image || ''"/>

        <Text class="title" :text="title?.title || title?.name"/>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IListTitle } from 'types/api/lists/title';

const windows = useWindowsStore();

const props = defineProps({
    listId: { type: String },
    title: {
        type: Object as PropType<IListTitle>,
        required: true
    }
});


function openWindow() {
    windows.create({
        component: 'ListsTitle',
        data: {
            listId: props.listId,
            titleId: props.title.name
        }
    });
}

</script>

<style lang="scss" scoped>

.list-title {
    cursor: pointer;
    width: 100%;
    position: relative;
    border-radius: 5px;

    &:active {
        .ui-image {
            background-size: 100% auto;
            transform: scale(.8);
        }
    }

    &:hover {
        .ui-image {
            background-size: 120% auto;
        }

        .title {
            color: var(--text-primary);
            text-decoration: underline;
        }
    }

    .ui-image {
        padding: 0 0 calc(100% + 64px) 0;
        width: 100%;
        height: 0;
        border-radius: 5px;
        background-size: 100% auto;
    }

    .title {
        margin: 8px 0 0 0;
        color: var(--text-secondary);
        font-weight: 700;
    }
}

</style>