<template>
    <img :src="data" v-if="data?.slice(0, 4) === 'http'">
    <i :class="`icon ${data}`" v-else-if="!getType"></i>
    <fa class="icon" :icon="data" v-else/>
</template>

<script>

export default {
    name: 'OtherIcon',
    components: {},
    computed: {
        getType() {
            return typeof this.data === 'object';
        }
    },
    props: ['data'],
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>

img {
    max-width: 18px;
    max-height: 18px;
    min-width: 18px;
    min-height: 18px;
}

</style>