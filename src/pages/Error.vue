<template>
    <div class="error">
        <div>404</div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ErrorPage',
    components: {},
    computed: {},
    data: () => ({}),
    watch: {},
    mounted() {}
});

</script>


<style lang="scss" scoped>

.page.error {
    display: flex;
    align-items: center;
    justify-content: center;

    div {
        font-size: var(--font);
    }
}

</style>