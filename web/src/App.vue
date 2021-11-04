<template>
    <router-view v-slot="{ Component, route }">
        <MainHeader/>
        <transition :enter-active-class="`animate__animated ${route.meta.transition || 'animate__zoomIn'}`">
            <component :class="{ 'page': true, 'hide': getPaint.open }" :is="Component"/>
        </transition>
        <Paint v-if="getPaint.open"/>
    </router-view>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

import MainHeader from '@/components/header.vue'
import Paint from '@/components/paint.vue'

export default {
    name: 'App',
    components: { MainHeader, Paint },
    computed: mapGetters(['isMenu', 'getTheme', 'getContacts', 'getPaint']),
    data() {
        return {
            titles: [
                "Minecraft?",
                "SOON",
                "True?",
                "#helloworld",
                "This Title",
                "Heito",
                "heito.xyz",
                "/set 0",
                "/undo",
                "Site",
                ":D",
                ":#",
                "bobiclaki",
                "bo-bic-laki",
                ":O",
                ":P",
                ":{",
                "ОГ",
                "бывает...",
                "пон)",
                ":)",
                "window.close()",
                "Dota 2",
                "Bye Bye"
            ],
            paint: false,
            connection: null
        }
    },
    sockets: {
        connect: () => {
            console.log('socket connected');
        }
    },
    methods: {
        ...mapActions(['setTheme', 'setPaint'])
    },
    mounted() {

        if (!localStorage["theme"]) this.setTheme("dark")
            else this.setTheme(localStorage.getItem('theme'))

        const setTitle = () => {
            document.title = this.titles[Math.floor(Math.random() * this.titles.length)]
            setTimeout(() => setTitle(), 10000)
        }
        setTitle()

        let clicks = 0
        document.onclick = () => {
            clicks++
            if (clicks === 100 && !localStorage['paint']) this.setPaint(true)
        }

    }
}
</script>

<style lang="scss">

.page {
    position: relative;
    min-width: 100%;
    min-height: 100vh;
}

.page.hide {
    transition: 1s;
    opacity: 0;
    z-index: -1;
}

</style>
