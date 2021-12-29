<template>
    <div class="games">
        <router-view v-slot="{ Component }">
            <transition>
                <component :class="{ 'game': true }" :is="Component"/>
            </transition>
        </router-view>
    </div>
</template>

<script>

export default {
    name: 'GamesPage',
    components: {},
    computed: {},
    data() {
        return {}
    },
    sockets: {},
    methods: {},
    mounted() {}
}
</script>

<style lang="scss">

.page.games {
    height: 100vh;
}

</style>