<template>
    <div class="error">
        <main>
            <div :class="`code font-${Math.floor(Math.random() * (25 - 1 + 1)) + 1}`">404</div>
            <div class="text">{{ texts[Math.floor(Math.random() * texts.length)] }}</div>
            <div class="back font-5" @click="router('/')">{{ btn[Math.floor(Math.random() * btn.length)] }}</div>
        </main>
        <div class="animate a1"></div>
        <div class="animate a2"></div>
    </div>
</template>

<script>

export default {
    name: 'ErrorPage',
    components: {},
    computed: {},
    data() {
        return {
            texts: [
                "Что ты пытался найти?",
                "Тут что-то должно быть?",
                "А как мне тебе это открыть?",
                "Может быть не суда?",
                "Давай назад...",
                "А можно я отсюда уйду.",
                "Тут страшно",
                "Привет? Может быть пока?",
                "Тебе не сюда :)"
            ],
            btn: [
                "Back",
                "To the main page",
                "Home",
                "To return"
            ]
        }
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss">

.page.error {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    
    main {
        display: flex;
        position: absolute;
        top: 50%;
        left: 50%;
        align-items: center;
        flex-direction: column;
        animation: ShowMain 2s;
        transform: translate(-50%, -50%);
        z-index: 2;

        .code {
            font-size: 64px;
        }

        .text {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .back {
            cursor: pointer;
            margin: 8px 0 0 0;
            padding: 8px 16px;
            position: relative;
            transition: .3s;
            overflow: hidden;

            &::after {
                content: "";
                width: 100%;
                height: 100%;
                position: absolute;
                top: 100%;
                left: 0;
                background: var(--color);
                transform: scale(.7);
                transition: .2s;
                z-index: -1;
            }

            &:hover {
                color: var(--color-r);
                text-decoration: underline;

                &::after {
                    top: 0;
                    transform: scale(1);
                }
            }
        }
    }

    .animate {
        position: absolute;

        &.a1 {
            width: 70vw;
            height: 70vw;
            left: -35%;
            bottom: -75%;
            // border-radius: 50%;
            border-left: 1px solid var(--color);
            animation: AnimateError_1 2s infinite, ShowAnimateError 2s;
            // box-shadow: 0 0 10px 2px var(--dimming-4), 0 0 10px 2px var(--dimming-4) inset;
            border-radius: 50%;
            box-shadow: 15px 15px 10px 2px var(--color), 15px 15px 10px 2px var(--color) inset;
        }

        &.a2 {
            width: 40vw; 
            height: 40vw;
            top: -20vw;
            right: -20vw;
            border: 1px solid var(--color);
            box-shadow: 0 0 10px 2px var(--color), 0 0 10px 2px var(--color) inset;
            animation: AnimateError_1 5s linear infinite, ShowAnimateError 1s;
        }
        &.a2:before, 
        &.a2:after {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute; 
            top: 50%; 
            left: 50%;
            border: 1px solid var(--color);
            box-shadow: 0 0 10px 2px var(--color), 0 0 10px 2px var(--color) inset;
        }
        &.a2:before {
            transform: translate(-50%, -50%) rotate(30deg);
        }
        &.a2:after {
            transform: translate(-50%, -50%) rotate(60deg);
        }

        @keyframes AnimateError_1 {
            to {
                transform: rotate(360deg);
            }
        }
        @keyframes ShowAnimateError {
            from {
                transform: scale(.7);
            }
        }
    }

    @keyframes ShowMain {
        from {
            transform: translate(-50%, -50%) scale(.7) translateY(-64px);
            opacity: 0;
        }
    }
}

</style>