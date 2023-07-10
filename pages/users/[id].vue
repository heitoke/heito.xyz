<template>
    <div></div>
</template>

<script lang="ts" setup>

const { $api, $router } = useNuxtApp();

const route = useRoute();

const windows = useWindowsStore();

const [user, status] = await $api.users.get(route.params.id as string);

if (status === 200) {
    const image = user?.banner || user?.avatar || '';

    useSeoMeta({
        title: `${user?.nickname || user?.username || user?._id} | User`,
        description: user?.description || '',
        ogImage: image,
        twitterImage: image,
        colorScheme: user?.color,
        themeColor: user?.color
    });
}


onMounted(() => {
    $router.push('/');
    
    if (status !== 200) return;

    windows.create({
        component: 'UserProfile',
        data: user._id
    });
});

</script>