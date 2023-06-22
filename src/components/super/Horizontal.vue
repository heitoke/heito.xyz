<template>
    <div class="super">
        <slot/>
    </div>
</template>

<script lang="ts" setup>

import Footer from '../Footer.vue';
import ScrollBar from '../content/ScrollBar.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HorizontalSuperMode',
    computed: {},
    props: {},
    mounted() {}
});

</script>

<style lang="scss" scoped></style>