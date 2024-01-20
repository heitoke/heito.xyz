<template>
    <div class="stats"></div>
</template>

<script lang="ts" setup>

const { $router } = useNuxtApp();


onMounted(() => {
    $router.push('/stats/code');
});


definePageMeta({
    pageOptions: {
        padding: '0 20%',
        name: 'stats',
        icon: 'stats',
        index: 5
    }
});

</script>

<style lang="scss" scoped>

.page.stats {
    padding: 0 20%;
}

</style>