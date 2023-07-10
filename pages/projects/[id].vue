<template>
    <div></div>
</template>

<script lang="ts" setup>

const { $api, $router } = useNuxtApp();

const route = useRoute();

const windows = useWindowsStore();

const [project, status] = await $api.projects.get(route.params.id as string);

if (status === 200) {
    const image = project?.banner || project?.image || '';

    useSeoMeta({
        title: `${project?.displayName || project?.name || project?._id} | Project`,
        description: project?.description || '',
        ogImage: image,
        twitterImage: image,
        colorScheme: project?.color,
        themeColor: project?.color,
        twitterCard: 'summary_large_image'
    });
}


onMounted(() => {
    $router.push('/');
    
    if (status !== 200) return;

    windows.create({
        component: 'ProjectProfile',
        data: project._id
    });
});

</script>