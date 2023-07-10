<template>
    <div></div>
</template>

<script lang="ts" setup>

const { $api, $router } = useNuxtApp();

const route = useRoute();

const windows = useWindowsStore();

const [user, status] = await $api.users.get(route.params.id as string);

console.log(user, status);


if (status === 200) {
    const image = user?.banner || user?.avatar || getAvatar({ nameId: user?._id });

    useSeoMeta({
        title: `${user?.nickname || user?.username || user?._id} | User`,
        description: user?.description || '',
        ogImage: image,
        twitterImage: image,
        colorScheme: user?.color,
        themeColor: user?.color,
        twitterCard: 'summary_large_image'
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