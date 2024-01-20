<template>
    <div class="project not" v-if="selfProject === 'load'">
        <Skeleton style="min-height: 215px;"></Skeleton>

        <Skeleton style="margin: 12px 0; width: 70%;"></Skeleton>
    </div>

    <div class="project not" v-else-if="selfProject === null">
        Error
    </div>

    <div class="project" v-else>
        <div class="header">
            <div class="image"></div>

            <div class="name">{{ project?.displayName }}</div>

            <div class="description">{{ project?.description }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import type { Project } from '~/types/api/project';


const { $api } = useNuxtApp();

const $route = useRoute();


const selfProject = ref<Project | 'load' | null>('load');


const project = computed(() => {
    if (selfProject?.value === 'load' || selfProject.value === null) return;

    return {
        ...selfProject.value
    }
});


async function fetchProject() {
    selfProject.value = 'load';

    const { ok, data } = await $api.projects.get($route.params.id as string);

    if (!ok) return selfProject.value = null;

    selfProject.value = data;
}


onMounted(() => {
    fetchProject();
});


definePageMeta({
    pageOptions: {
        padding: '0 20%'
    }
});

</script>

<style lang="scss" scoped>

.page.project {
    padding: 0 20%;
}

.page.project:not(.not) {
    .header {
        .image {
            height: 215px;
            border-radius: 10px;
            background-color: var(--background-secondary);
        }

        .name {
            margin: 12px 0;
            font-size: 24px;
            font-weight: 600;
        }
    }
}

</style>