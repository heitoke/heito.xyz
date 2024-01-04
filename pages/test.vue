<template>
    <div class="test">
        Test
    </div>
</template>

<script lang="ts" setup>

const $windows = useWindowsStore();


definePageMeta({
    pageOptions: {
        name: 'test',
        padding: '0 20%'
    }
});

</script>

<style lang="scss" scoped>

.page.test {
    padding: 0 20%;
}

</style>