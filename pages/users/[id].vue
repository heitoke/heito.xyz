<template>
    <div></div>
</template>

<script lang="ts" setup>

import { createUserMetaImage } from '~/libs/canvas';

const { $api, $router } = useNuxtApp();

const route = useRoute();

const windows = useWindowsStore();

const [user, status] = await $api.users.get(route.params.id as string);

if (status === 200) {
    const image = await createUserMetaImage(user?.nickname as string, getAvatar({ nameId: user?._id }));// user?.banner || user?.avatar || getAvatar({ nameId: user?._id });

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