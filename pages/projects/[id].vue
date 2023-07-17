<template>
    <div></div>
</template>

<script lang="ts" setup>

const { $api, $router } = useNuxtApp();

const route = useRoute();

const windows = useWindowsStore();

const [project, status] = await $api.projects.get(route.params.id as string);

if (status === 200) {
    useSeoMeta(seo.createTemplate({
        title: `${project?.displayName || project?.name || project?._id} | Project`,
        description: project?.description || '',
        image: project?.banner || project?.image || '',
        color: project?.color
    }));
}


onMounted(() => {
    $router.push('/projects');
    
    if (status !== 200) return;

    windows.create({
        component: 'ProjectProfile',
        data: project?._id
    });
});

</script>