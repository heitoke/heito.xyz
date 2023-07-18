<template>
    <div class="search">
        123
    </div>
</template>

<script lang="ts" setup>

import NavBar from '~/components/content/NavBar.vue';

import ScrollBar from '~/components/content/ScrollBar.vue';

const props = defineProps({
    windowId: { type: Number }
});

</script>

<style lang="scss" scoped>

.block.search {
    max-width: 512px;
    position: relative;
}

</style>