<template>
    <div></div>
</template>

<script lang="ts" setup>

const { $api, $router } = useNuxtApp();

const route = useRoute();

const windows = useWindowsStore();

const [user, status] = await $api.users.get(route.params.id as string);

if (status === 200) {
    useSeoMeta(seo.createTemplate({
        title: `${user?.nickname || user?.username || user?._id} | User`,
        description: user?.description || '',
        image: user?.banner || user?.avatar || getAvatar({ nameId: user?._id }),
        color: user?.color
    }))
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