<template>
    <router-view v-slot="{ Component }">
        <MainHeader/>
        <Menu v-if="getMenu.length > 0"/>
        <div :class="['basic-page', { super: isSuper }]">
            <transition enter-active-class="page-show" leave-active-class="page-hide">
                <component :class="['page']" :is="Component" @click="isSuper ? setSuper('auto') : null"/>
            </transition>
            <transition enter-active-class="list-pages-show" leave-active-class="list-pages-hide">
                <ul class="list-pages" v-if="isSuper">
                    <div>Pages</div>
                    <li v-for="r of listRouters" :key="r"
                        :class="{ active: $route.path === r.path }"
                        @click="router(r.path)"
                    >
                        <i :class="r.meta.icon"></i>
                        <span>{{ r.meta.label }}</span>
                    </li>
                </ul>
            </transition>
        </div>
    </router-view>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

import MainHeader from './components/header.vue'

export default {
    name: 'App',
    components: { MainHeader },
    computed: {
        ...mapGetters(['getMenu'])
    },
    data() {
        return {}
    },
    methods: {
        ...mapActions(['setTheme', 'setColor']),
        async loadContent() {
            let content = await this.fetch('/content');
            this.setContent(content);
        }
    },
    mounted() {

        this.setTheme(localStorage["theme"] || "dark");
        this.setColor(this.getLocal?.mainColor || 'var(--C1)');

        document.onkeydown = e => {
            if (this.getMenu.length > 0) return;
            // ? Open/Close Super mode
            if (e.keyCode === 9) {
                e.preventDefault();
                this.setSuper('auto');
            }

            // ? Open Settings
            if (e.ctrlKey && e.keyCode === 83) this.setMenu(['SettingsMenu'])

        }
        
        window.addEventListener('contextmenu', e => {
            e.preventDefault();
        });

        this.loadContent();

    }
}
</script>

<style lang="scss">

.basic-page {
    display: flex;
    max-width: 100%;
    width: 100% !important;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    // max-height: calc(100vh - 48px);
    transition: .2s;
    z-index: 10;
    
    &.super {
        max-width: 120% !important;
        width: 120% !important;
        left: -10%;
        grid-template-columns: 1fr 1fr;
        transform: scale(.7);
        user-select: none;

        .page {
            padding: 24px;
            min-width: calc(100% - 256px);
            border: 4px solid var(--dimming);
            border-radius: 25px !important;
            background: var(--bg);
            overflow: hidden;

            &::after {
                content: " ";
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1000;
            }

            &-show, &-hide {
                transform: scale(.6);
            }
        }
    }

    .page {
        padding-top: 48px;
        width: 100%;
        position: relative;
        border: 4px solid var(--T);
        box-sizing: border-box;
        transition: all .2s;
        overflow-x: hidden;

        &-show, &-hide {
            transition: .2s;
            opacity: 0;
        }
    }

    .list-pages {
        margin: 0 0 0 32px;
        padding: 0 8px;
        width: 256px;
        min-width: 256px;
        max-height: 100%;
        transition: all .2s;
        overflow-x: hidden;

        &-show, &-hide {
            margin: 0px;
            width: 0px;
            min-width: 0px !important;
            opacity: 0;
        }

        div {
            margin: 0 0 8px 0;
            color: var(--color-2);
            font-weight: 700;
            text-transform: uppercase;
        }

        li {
            cursor: pointer;
            display: flex;
            margin: 0 0 8px 0;
            padding: 12px 16px;
            color: var(--color-2);
            border-radius: 5px;
            align-items: center;
            transition: .2s;

            &:last-child {
                margin: 0;
            }

            i {
                margin: 0 8px 0 0;
                font-size: 20px;
            }

            &.active {
                color: var(--color);
                background: var(--dimming);

                i {
                    color: var(--C1);
                }
            }
        }
    }
}

@media (max-width: 640px) {
    .basic-page {
        &.super {
            flex-direction: column;

            .page {
                min-width: 100%;
                min-height: 50%;
                max-height: 50%;
            }
        }

        .page {
            min-width: 100%;
        }

        .list-pages {
            margin: 32px 0 0 0;
            padding: 0 8px;
            width: 100%;
            min-width: 256px;
            max-height: 100%;
            transition: all .2s;
            overflow-x: hidden;

            div {
                margin: 0 0 8px 0;
                color: var(--color-2);
                font-weight: 700;
                text-transform: uppercase;
            }

            li {
                cursor: pointer;
                display: flex;
                margin: 0 0 8px 0;
                padding: 12px 16px;
                color: var(--color-2);
                border-radius: 5px;
                align-items: center;
                transition: .2s;

                &:last-child {
                    margin: 0;
                }

                i {
                    margin: 0 8px 0 0;
                    font-size: 20px;
                }

                &.active {
                    color: var(--color);
                    background: var(--dimming);

                    i {
                        color: var(--C1);
                    }
                }
            }
        }
    }
}

.key {
    cursor: default;
    padding: 4px 8px;
    color: var(--color-2);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    border-radius: 5px;
    background: var(--dimming);
    box-shadow: 0px 4px 0 0 var(--bg-3);
    transition: .2s;
    user-select: none;

    &:active {
        color: var(--color);
        box-shadow: 0px 4px 0 0 var(--T);
        transform: translateY(4px);
    }
}

.glitch {
    position: relative;
    text-decoration: none;
    // text-transform: uppercase;
    color: #fff;
    font-weight: 600;
    letter-spacing: 5px;
    user-select: none;

    &:before, &:after {
        display: block;
        content: attr(data-glitch);
        // text-transform: uppercase;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        opacity: .8;
    }
    &:after {
        color: #f0f;
        animation: glitch .3s cubic-bezier(.25, .46, .45, .94) infinite;
        z-index: -2;
    }
    &:before {
        color: #0ff;
        animation: glitch .3s cubic-bezier(.25, .46, .45, .94) infinite reverse;
        z-index: -1;
    }
}

$fs: 3px;

@keyframes glitch {
    0% {
        transform: translate(0)
    }
    20% {
        transform: translate(-$fs, $fs)
    }
    40% {
        transform: translate(-$fs, -$fs)
    }
    60% {
        transform: translate($fs, $fs)
    }
    80% {
        transform: translate($fs, -$fs)
    }
    to {
        transform: translate(0)
    }
}


.tags {
    display: flex;
    margin: 4px 0;
    align-items: center;
    flex-flow: wrap;
    gap: 8px;

    li {
        padding: 4px 8px;
        font-size: 14px;
        white-space: nowrap;
        border-radius: 5px;
        transition: .2s;
        user-select: none;

        &:last-child {
            margin:  0;
        }

        &:hover {
            background: var(--dimming);
        }

        i {
            margin: 0 4px 0 0;
            color: var(--main-color);
        }

        span {
            max-width: 64px;
            color: var(--color-2);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
}

</style>
