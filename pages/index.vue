<template>
    <div class="home">
        <h1>Hello world</h1>

        <Select label="das"
            :options="[{value: 'ads'}]"
        />
    </div>
</template>

<script lang="ts" setup>

definePageMeta({
    pageOptions: {
        name: 'home',
        icon: 'earth',
        index: 0
    },
    flags: ['hide-footer']
});

</script>

<style lang="scss" scoped>

.page.home {
    height: 10000px;

    .te {
        margin: 12px 0;
        padding: 12px;
        max-width: 315px;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
    }
}

</style>