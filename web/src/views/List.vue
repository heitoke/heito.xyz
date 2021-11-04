<template>
    <div class="list">
        Test
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'ListPage',
    components: {},
    computed: mapGetters(['getWS']),
    data() {
        return {}
    },
    methods: {
        ...mapActions(['setConnectWS'])
    },
    mounted() {}
}
</script>

<style lang="scss">

</style>