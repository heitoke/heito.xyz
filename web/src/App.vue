<template>
    <router-view v-slot="{ Component }">
        <MainHeader/>
        <MainNotifications/>
        <transition>
            <component :class="{ 'page': true, 'hide': getPaint.open }" :is="Component"/>
        </transition>
        <Paint v-if="getPaint.open"/>
    </router-view>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

import MainHeader from '@/components/header.vue'
import MainNotifications from '@/components/notifications.vue'
import Paint from '@/components/paint.vue'

export default {
    name: 'App',
    components: { MainHeader, MainNotifications, Paint },
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
    methods: {
        ...mapActions(['setTheme', 'setPaint', 'close', 'addNotification'])
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
        document.onclick = () => clicks === 100 && !localStorage['paint'] ? this.setPaint(true) : clicks++

        console.log(`██╗░░██╗███████╗██╗████████╗░█████╗░░░░██╗░░██╗██╗░░░██╗███████╗\n██║░░██║██╔════╝██║╚══██╔══╝██╔══██╗░░░╚██╗██╔╝╚██╗░██╔╝╚════██║\n███████║█████╗░░██║░░░██║░░░██║░░██║░░░░╚███╔╝░░╚████╔╝░░░███╔═╝\n██╔══██║██╔══╝░░██║░░░██║░░░██║░░██║░░░░██╔██╗░░░╚██╔╝░░██╔══╝░░\n██║░░██║███████╗██║░░░██║░░░╚█████╔╝██╗██╔╝╚██╗░░░██║░░░███████╗\n╚═╝░░╚═╝╚══════╝╚═╝░░░╚═╝░░░░╚════╝░╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝\nHello :D`)

    }
}
</script>

<style lang="scss">

.page {
    position: relative;
    width: 100%;
    // min-height: 100vh;
}

.page.hide {
    transition: 1s;
    opacity: 0;
    z-index: -1;
}


.checkbox {
    user-select: none;
    
    input[type=checkbox] {
        height: 0;
        width: 0;
        position: absolute;
        visibility: hidden;
    }
    
    span {
        cursor: pointer;
        display: block;
        width: 17px;
        height: 17px;
        position: relative;
        text-indent: -9999px;
        border-radius: 50%;
        border: 3px solid var(--color-2);
        transition: .2s;
    }
    
    input:checked + span {
        border-radius: 0;
        box-shadow: 0 0 7px 0px var(--dimming-3), 0 0 7px 0px var(--dimming-3) inset;
        transform: rotate(135deg) scale(.9);
    }
    
    &:active span:after {
        width: 14px;
    }
    
}

.radio {
    display: flex;
    margin: 4px;
    align-items: center;
    user-select: none;
    
    input[type=radio] {
        height: 0;
        width: 0;
        position: absolute;
        visibility: hidden;
    }
    
    span {
        cursor: pointer;
        display: block;
        margin: 0 8px 0 0;
        width: 14px;
        height: 14px;
        position: relative;
        text-indent: -9999px;
        border-radius: 50%;
        border: 3px solid var(--color);
        transition: .2s;
    }
    
    input:checked + span {
        border-radius: 0;
        background: var(--color);
        transform: rotate(135deg) scale(.7);
    }
    
    &:active span:after {
        width: 14px;
    }
    
}

</style>
