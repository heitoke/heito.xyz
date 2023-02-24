<template>
    <footer>
        © 2023 heito.xyz
    </footer>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
    name: 'Footer',
    components: {},
    computed: {
        ...mapGetters([])
    },
    data: () => ({}),
    watch: {},
    methods: {
        ...mapActions([]),
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

footer {
    margin: 64px 0 0 0;
    padding: 5vh 10vw;
    width: 100%;
    // height: 100px;
    border-top: 1px solid var(--background-secondary);
}

</style>