<template>
    <div :class="`main-header ${getPaint.open ? 'hide' : ''}`">
        <div class="menu" v-if="menu.open">
            <div class="close-menu" @click="menu.open = false">
                <i class="uil uil-multiply"></i>
            </div>
            <ul class="font-5">
                <li v-for="button of menu.buttons" :key="button"
                    :class="{ 'active': this.$route.path === button.path }"
                    @click="button.a ? redirect(button.path) : router(button.path); menu.open = false"
                >{{ button.title }}</li>
                <li v-if="isPaint" @click="setPaint(true)">Paint</li>
            </ul>
        </div>
        <div class="logo">
            <div class="open-menu" @click="menu.open = !menu.open">
                <i class="uil uil-ellipsis-v"></i>
            </div>
            <span :class="`font-${Math.floor(Math.random() * (25 - 1 + 1)) + 1}`">heito.xyz</span>
        </div>
        <ul class="buttons font-5" v-if="!menu.open">
            <li v-for="button of menu.buttons" :key="button"
                :class="{ 'active': this.$route.path === button.path }"
                @click="button.a ? redirect(button.path) : router(button.path); menu.open = false"
                :ui-title="this.$route.path === button.path ? 'Ты уже тут (:' : button.text" uit-bottom
            >{{ button.title }}</li>
            <li v-if="isPaint" @click="setPaint(true)" ui-title="Опа... А это что?" uit-bottom>Paint</li>
        </ul>
        <div class="theme" @click="setTheme(getTheme === 'dark' ? 'light' : 'dark')">
            <i :class="getTheme === 'dark' ? 'uil uil-moon' : 'uil uil-sun'"></i>
        </div>
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'MainHeader',
    computed: mapGetters(['getTheme', 'isPaint', 'getPaint']),
    data() {
        return {
            menu: {
                open: false,
                buttons: [
                    { title: 'Home', path: '/', text: 'Привет :O' },
                    { title: 'Projects', path: '/projects' },
                    // { title: 'Stats', path: '/stats' },
                    { title: 'Chat', path: 'https://chat.akiracommunity.ru', a: true, text: 'Мини хобби :D' }
                ]
            }
        }
    },
    methods: {
        ...mapActions(['setTheme', 'setPaint'])
    },
    mounted() {}
}

</script>

<style lang="scss">

.main-header.hide {
    top: -100% !important;
    transition: 1s;
    opacity: 0;
    z-index: -1;
}

.main-header {
    display: flex;
    width: 100%;
    height: 36px;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: space-between;
    transition: .2s;
    z-index: 100;

    .logo {
        display: flex;
        margin: 0 0 0 16px;
        align-items: center;

        .open-menu {
            display: none;
            margin: 0 16px 0 0;
        }
    }

    .menu {
        display: flex;
        width: 100%;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        color: #e8e8e8;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        animation: ShowMenu .5s;
        background: #000000ce;
        z-index: 101;
        
        .close-menu {
            position: absolute;
            top: 36px;
            color: var(--color-3);
            font-size: 28px;
        }

        ul {
            display: flex;
            text-align: center;
            align-items: center;
            flex-direction: column;

            li {
                font-size: 32px;
            }
        }
    }

    .buttons {
        display: flex;
        position: absolute;
        left: 50%;
        align-items: center;
        transform: translateX(-50%);
        user-select: none;

        li {
            cursor: pointer;
            margin: 0 8px;
            color: var(--color-2);
            font-weight: 600;
            transition: .2s;

            &:hover,
            &.active {
                color: var(--color);
                text-decoration: underline;
            }
        }
    }

    .theme {
        cursor: pointer;
        margin: 0 12px 0 0;
        width: 28px;
        height: 28px;
        font-size: 16px;
        text-align: center;
        line-height: 28px;
        transition: .2s, box-shadow .5s;

        &:hover,
        &:active {
            border-radius: 50%;
            background: var(--dimming);
        }

        &:active {
            box-shadow: 0 0 100vw 100vw var(--color);
            transform: scale(1.05) rotate(720deg);
        }
    }

    @keyframes ShowMenu {
        from {
            opacity: 0;
        }
    }

    @media (max-width: 540px) {
        .logo {
            .open-menu {
                display: block;
            }
        }

        .buttons {
            display: none;
        }
    }
}

</style>
