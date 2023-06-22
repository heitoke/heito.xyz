<template>
    <div class="error">
        <div>404</div>
        {{ type }}
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'ErrorPage',
    components: {},
    computed: {},
    props: {},
    data: () => ({
        type: 'error' as 'error' | 'blocked'
    }),
    watch: {},
    mounted() {
        console.log(this.$route);
        
    }
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