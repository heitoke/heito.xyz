<template>
    <div class="collections">
        Store
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'GamePetsStore',
    computed: mapGetters([]),
    data() {
        return {}
    },
    methods: {
        ...mapActions([])
    },
    mounted() {}
}

</script>

<style lang="scss">

.page.games .game.pets .category.store {}

</style>
