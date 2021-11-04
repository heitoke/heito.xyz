<template>
    <div class="main">
        <div class="animate a1"></div>
        <div class="animate a2"></div>
        <div class="animate a3"></div>
        <div class="animate a4"></div>
        <div class="animate a5"></div>
        <div class="animate a6"></div>
        <ul class="contacts">
            <li v-for="contact of getContacts" :key="contact">
                <div class="button" v-html="iconContacts[contact.type]"
                    @click="redirect(contact.data.url)"
                ></div>
                <ContactCard :name="contact.type" :user="contact.data"/>
            </li>
        </ul>
        <div class="about">
            <div :class="`title font-${Math.floor(Math.random() * (25 - 1 + 1)) + 1}`">{{ titles[Math.floor(Math.random() * titles.length)] }}</div>
            <div class="text">{{ texts[Math.floor(Math.random() * texts.length)] }}</div>
        </div>
    </div>
</template>

<script>

// import io from "socket.io-client";

import { mapActions, mapGetters } from 'vuex'

import ContactCard from '../components/contact.vue'

export default {
    name: 'MainPage',
    components: { ContactCard },
    computed: mapGetters(['getContacts', 'getWS']),
    data() {
        return {
            con: null,
            titles: [
                "Heito?",
                "Heito",
                "bo-bic-laki",
                "Aisuru",
                "bobiclaki",
                "MusicMIKI"
            ],
            texts: [
                "Hello",
                "World",
                "Hello World :D",
                "#helloworld",
                "My name is Nikita?",
                "Я тут :D",
                "Может мне уйти",
                "Вы меня не ждали (",
                "...",
                "Можно домой?",
                "Хочу пирожок :O",
                "Кликай и узнаешь!!! :D",
                "Хочешь пирожок? :D",
                "Я дома... Уху :)",
                "Рита?",
                "Мне 9 лет?",
                "Ненависть",
                "Привет и пока :#"
            ],
            iconContacts: {
                spotify: '<i class="fab fa-spotify"></i>',
                steam: '<i class="fab fa-steam"></i>',
                github: '<i class="fab fa-github"></i>',
                minecraft: '<img src="https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/favicon-32x32.png" alt="Icon Minecraft">'
            }
        }
    },
    sockets: {
        loadServices(data) {
            this.setContacts(data)
        },
        loadActivity(data) {
            this.setContactActivity(data)
        }
    },
    methods: {
        ...mapActions(['setContacts', 'setContactActivity', 'setConnectWS'])
    },
    mounted() {}
}
</script>

<style lang="scss">

.page.main {
    overflow: hidden;

    .contacts {
        position: absolute;
        top: 48px;
        left: 8px;

        li {
            position: relative;
            
            &:hover {
                .button {
                    border-radius: 5px 0 5px 0;
                    background: var(--dimming);
                }
                .contact-card {
                    display: block;
                    position: absolute;
                    top: 0;
                    left: calc(100% + 2px);
                }
            }

            .button {
                cursor: pointer;
                width: 32px;
                height: 32px;
                font-size: 18px;
                text-align: center;
                line-height: 32px;
                transition: .2s;

                img {
                    margin: 4px 0 0 0;
                    width: 24px;
                    height: 24px;
                }
            }
            .contact-card {
                display: none;
            }
        }
    }

    .animate {
        position: absolute;
        
        &.a1,
        &.a2,
        &.a4,
        &.a5,
        &.a6 {
            border: 5px solid var(--color);
            box-shadow: 0 0 10px 2px var(--dimming-4), 0 0 10px 2px var(--dimming-4) inset;
        }

        &.a1 {
            width: 40%;
            height: 40vw;
            top: -15%;
            left: 30%;
            border-radius: 50% 50% 50% 25%;
            animation: Animate_1 50s infinite, ShowAnimate .5s;
            transform: translate(-50%, -50%);
        }

        &.a2 {
            width: 10%;
            height: 10vw;
            top: 70%;
            right: 10%;
            border-radius: 50% 5px;
            animation: Animate_1 20s infinite, ShowAnimate .5s;
            // transform: translate(-50%, -50%);

            &::after {
                content: " ";
                width: 100%;
                height: 5px;
                position: absolute;
                top: 50%;
                left: 50%;
                box-shadow: 0 0 10px 2px var(--dimming-4), 0 0 10px 2px var(--dimming-4) inset;
                background: var(--color);
                transform: translate(-50%, -50%) rotate(-45deg);
                transition: .2s;
            }

            &:hover::after {
                width: 142%;
            }
        }

        &.a3 {
            width: 10%;
            height: 10vw;
            top: 20%;
            right: 13%;
            transform: rotate(15deg);

            &::after,
            &::before {
                content: " ";
                width: 100%;
                height: 5px;
                position: absolute;
                box-shadow: 0 0 10px 2px var(--dimming-4), 0 0 10px 2px var(--dimming-4) inset;
                background: var(--color);
            }

            &::after {
                transform: rotate(45deg);
            }
            &::before {
                transform: rotate(-45deg);
            }
        }

        &.a4 {
            width: 36px;
            height: 36px;
            top: 35%;
            left: 30%;
            transform: rotate(-15deg);
            transition: .5s;

            &:hover {
                transform: rotate(15deg) scale(20);
                z-index: 3;
            }
        }

        &.a5 {
            width: 36px;
            height: 36px;
            top: 17%;
            right: 40%;
            border-radius: 50%;
            transition: .2s;

            &:hover {
                border-radius: 25px 0 25px 0;
                transform: scale(1.5) rotate(-45deg);
            }
        }

        &.a6 {
            width: 20%;
            height: 10vw;
            left: 15%;
            bottom: 17%;
            transform: rotate(25deg);
            transition: .2s;

            &:hover {
                border: 5px solid var(--color-r);
                background: var(--color);
            }

            &:active {
                transform: scale(50);
                z-index: 104;
            }
        }

        @keyframes ShowAnimate {
            from {
                transform: translate(-50%, -50%) scale(.7);
            }
        }

        @keyframes Animate_1 {
            from {
                transform: translate(-50%, -50%) rotate(0);
            }
            to {
                transform: translate(-50%, -50%) rotate(360deg);
            }
        }
    }

    .about {
        position: absolute;
        top: 50%;
        left: 50%;
        text-align: center;
        animation: ShowAbout .5s;
        transform: translate(-50%, -50%);

        .title {
            font-size: 32px;
            text-shadow: 0px -5px 5px var(--dimming-4);
            
            &.font-10,
            &.font-11,
            &.font-20 {
                font-size: 24px;
            }
        }

        .text {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
    }

    @keyframes ShowAbout {
        from {
            transform: translate(-50%, 200%);
            opacity: 0;
        }
    }
    
    @media (max-width: 540px) {
        .animate.a1 {
            width: 90%;
            height: 90vw;
            top: -5%;
        }
    }
}

</style>