<template>
    <header :style="{
        'backdrop-filter': getHeaderOptions.blur.enable ? `blur(${getHeaderOptions.blur.value})` : '' }"
    >
        <Transition name="loading">
            <div class="loading" v-show="getHeaderLoading.process > 0 && getHeaderLoading.process < 100">
                <div :style="{ width: `${getHeaderLoading.process}%`, background: getHeaderLoading.color }"></div>
            </div>
        </Transition>
        <div class="left">
            <RouterLink class="logo" to="/">heito.xyz</RouterLink>
            <div class="track">
                <div class="image" :style="{ '--image': `url(${track.image})` }"></div>
                <div>
                    <div class="label">{{ track.name }}</div>
                    <div class="description">{{ track.description }}</div>
                    <div class="process">
                        <div :style="{ width: '10%' }"></div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div :class="['notifications', { 'new-message': getListNotifications.filter((n: any) => !n?.hide)?.length > 0 }]"
                @click="setActiveNotifications(!getActiveNotifications)"
                @mouseenter="setToolpic({ name: 'notification', title: getLang.global.notification[0], position: 'bottom' })"
            >
                <Icon name="notification"/>
            </div>

            <div :class="['account', { active: menu.isActive }]" ref="account">
                <div class="data">
                    <div class="header">
                        <Transition name="account-username">
                            <div class="username" v-show="menu.isActive">heito</div>
                        </Transition>
                        <div class="avatar"
                            @click="openProfileMenu"
                        >
                            <div :style="{ '--avatar': `url('${getAvatar()}')` }"></div>
                        </div>
                    </div>
                    <Transition name="account-menu">
                        <Menu :menu="getProfileMenu" v-if="menu.isActive"/>
                    </Transition>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">

import Menu from './content/Menu.vue';

import { getAvatar } from '../libs/functions';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import type { IContextMenu, IContextMenuButton } from '../store/modules/contextMenu';

import Langs from '../libs/langs';

export default defineComponent({
    name: 'MainHeader',
    components: {},
    computed: {
        ...mapGetters(['getLangName', 'getLang', 'getActiveNotifications', 'getListNotifications', 'getHeaderLoading', 'getHeaderOptions']),
        getProfileMenu(): IContextMenu {
            return {
                name: 'header:profile:menu',
                buttons: [
                    {
                        label: this.getLang.global.settings,
                        icon: 'settings',
                        click: () => {
                            this.createWindow({ title: 'Test', component: 'Test' });
                        }
                    },
                    {
                        label: this.getLang.global.theme.dark,
                        icon: 'sun-moon',
                        value: this.darkTheme,
                        checkbox: (value: boolean) => {
                            this.darkTheme = value;
                        }
                    },
                    {
                        label: this.getLang.global.lang[1],
                        icon: 'lang',
                        children: {
                            name: 'header:lang',
                            title: this.getLang.global.lang[1],
                            buttons: Object.keys(Langs).map((key: any) => ({
                                // @ts-ignore
                                label: `${Langs[key][this.getLangName] || Langs[key].name} ${this.getLangName === key ? '(now)' : ''}`,
                                icon: 'lang',
                                text: 'Beta',
                                click: () => {
                                    this.setLang(key);
                                }
                            }))
                        }
                    },
                    {
                        separator: true
                    },
                    {
                        label: this.getLang.global.exit[1],
                        icon: 'sign-out',
                        class: 'exit'
                    }
                ]
            } as IContextMenu;
        }
    },
    data: () => ({
        darkTheme: true,
        menu: {
            isActive: false
        },
        track: {
            image: 'https://www.patee.ru/r/x6/10/a5/d5/512x512.jpg',
            name: 'Name',
            description: 'Description',
            process: {
                start: 0,
                end: 0,
                value: 0
            }
        }
    }),
    watch: {},
    methods: {
        ...mapActions(['setLang', 'setActiveNotifications', 'setToolpic', 'createWindow']),
        log(e: any) {
            console.log(e);
            
        },
        openProfileMenu(e: Event) {
            this.menu.isActive = true;
            
            let close = () => {
                window.addEventListener('click', (e) => {
                    // @ts-ignore
                    if (this.$refs?.account?.contains(e.target)) return close();
                    
                    this.menu.isActive = false;
                }, { once: true });
            }
            
            setTimeout(() => {
                close();
            }, 10);
        }
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.account-menu-enter-active,
.account-menu-leave-active {
    transform: scale(0.8);
    opacity: 0;
}

.account-username-enter-active,
.account-username-leave-active {
    transform: scale(0.8) translateX(100%);
    opacity: 0;
}

.loading-enter-active,
.loading-leave-active {
    top: -4px;
    opacity: 0;
}

header {
    display: flex;
    padding: 0 10vw;
    width: 100vw;
    height: 64px;
    position: fixed;
    top: 0px;
    left: 0px;
    align-items: center;
    justify-content: space-between;
    
    box-sizing: border-box;
    z-index: 100;

    .loading {
        width: 100%;
        height: 2px;
        position: absolute;
        top: 0;
        left: 0;
        background: var(--background-secondary);
        transition: .2s;
        overflow: hidden;

        div {
            height: 2px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: var(--C1);
            transition: .2s;
        }
    }

    .left {
        display: flex;
        align-items: center;
        
        .logo {
            position: relative;
            color: var(--text-primary);
            text-decoration: none;
            transition: .2s;

            &::after {
                content: " ";
                width: 0px;
                position: absolute;
                top: calc(100% - 2px);
                left: 0px;
                border-bottom: .5px solid var(--text-primary);
                transition: .2s;
                mix-blend-mode: difference;
            }

            &:hover {
                &::after {
                    width: 100%;
                }
            }
        }

        .track {
            display: flex;
            margin: 0 0 0 32px;
            max-width: 256px;
            width: 256px;
            align-items: center;

            .image {
                margin: 0 8px 0 0;
                min-width: 42px;
                min-height: 42px;
                border-radius: 5px;
                background-size: cover;
                background-position: center;
                background-image: var(--image);
                background-color: var(--background-secondary);
            }

            .image + div {
                width: 100%;
            }

            .label {
                font-size: 13px;
                font-weight: 700;
            }

            .description {
                color: var(--text-secondary);
                font-size: 12px;
            }

            .process {
                margin: 4px 0 0 0;
                width: 100%;
                height: 3px;
                position: relative;
                border-radius: 5px;
                background-color: var(--background-secondary);
                overflow: hidden;

                div {
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: var(--C1);
                    transition: .2s;
                }
            }
        }
    }

    .left + div {
        display: flex;
        align-items: center;
        justify-content: center;

        .notifications {
            cursor: pointer;
            margin: 0 12px 0 0;
            height: 16px;
            position: relative;

            &::after {
                content: " ";
                width: 8px;
                height: 8px;
                position: absolute;
                top: -4px;
                right: -2px;
                border-radius: 2px;
                background-color: var(--C1);
                transform: scale(0);
                transition: .2s;
                opacity: 0;
            }

            &.new-message {
                &::after {
                    transform: rotate(-45deg) scale(1);
                    opacity: 1;
                }
            }
        }

        .account {
            min-width: 42px;
            position: relative;
            transition: .2s;

            &.active {
                min-width: 196px;
            }

            .data {
                width: 100%;
                position: absolute;
                top: -22px;
                border: 1px solid var(--T);
                backdrop-filter: blur(5px);
                transition: .2s;
            }

            &.active .data {
                padding: 8px;
                border-radius: 5px;
                border-color: var(--background-secondary);
                top: -24px;

                &::before {
                    content: " ";
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-radius: 5px;
                    background: var(--background-secondary);
                    opacity: .5;
                    z-index: -1;
                }

                .header {
                    cursor: pointer;
                    padding: 16px 8px;
                    border-radius: 5px;
                    backdrop-filter: blur(5px);
                    overflow: hidden;

                    &::after {
                        content: " ";
                        opacity: 1;
                    }

                    .avatar {
                        min-width: 32px;
                        min-height: 32px;
                        border-radius: 50%;
                    }
                }
            }

            .header {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                transition: all .2s;
                z-index: 2;

                &:hover {
                    &::after {
                        transform: scale(1.5);
                    }
                }

                &::after {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    background-size: cover;
                    background-position: center;
                    background-image: url('https://avatars.mds.yandex.net/i?id=b5ed82d65587a3cd0a6818c4c02c16e15c046b92-8497600-images-thumbs&n=13');
                    transform: scale(1.2);
                    transition: .2s;
                    filter: blur(2px);
                    opacity: 1;
                    z-index: -1;
                }

                .username {
                    max-width: 100%;
                    margin: 0 12px 0 0;
                    padding: 0 0 0 12px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }

            .avatar {
                cursor: pointer;
                display: flex;
                min-width: 42px;
                min-height: 42px;
                border-radius: 10px;
                align-items: center;
                justify-content: center;
                transform: rotate(25deg);
                transition: .2s;
                overflow: hidden;

                &:hover {
                    box-shadow: 0 0 0 2px var(--background-secondary);
                }

                div {
                    width: 120%;
                    height: 120%;
                    position: absolute;
                    background-size: cover;
                    background-color: var(--background-secondary);
                    background-image: var(--avatar);
                    background-position: 50% 50%;
                    transform: rotate(-25deg);
                }
            }

            .menu {
                margin: 8px 0 0 0;
            }
        }
    }
}

</style>