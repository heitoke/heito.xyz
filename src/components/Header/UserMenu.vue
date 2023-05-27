<template>
    <div :class="['account', { active }]" ref="account">
        <div :class="['data', { blur: active }]">
            <div class="header"
                :style="{
                    padding: active ? `${getUser?.banner ? 20 : 16}px 8px` : undefined,
                    '--color': getUser?.color || 'var(--main-color)',
                    '--image': `url('${getUser?.banner || null}')`
                }"
                @click="active ? $windows.create({ component: 'User', data: getUser?._id }) : false"
            >
                <Transition name="account-username">
                    <div class="username" v-show="active"
                        :style="{
                            color: getUser?.color && !getUser?.banner ? colors.altColor(getUser?.color) : '#fff'
                        }"
                    >{{ getUser?.nickname || getUser?.username || getUser?._id || 'Guest' }}</div>
                </Transition>

                <div :class="['avatar', { 'a-loading': !getUser?._id }]"
                    @click.prevent.stop="active ? $windows.create({ component: 'User', data: getUser?._id }) : open($event, 'account', () => active = true, () => active = false)"
                >
                    <div :style="{ '--avatar': `url('${getUser?.avatar || getAvatar({ nameId: getUser?._id })}')` }" v-if="getUser?._id"></div>
                    <Loading type="circle" v-else/>
                </div>
            </div>
            <!-- <div class="level" v-if="active">
                <div class="bar" :style="{ '--p': '90%' }"></div>
                <div class="text">
                    <span>9 lvl</span>
                    <span>10 lvl</span>
                </div>
            </div> -->
            <Transition name="account-menu">
                <Menu :menu="getProfileMenu" style="margin: 12px 0 0 0;" v-if="active"/>
            </Transition>
        </div>
    </div>
</template>

<script lang="ts" setup>

import Menu from '../content/Menu.vue';

import { getAvatar, colors } from '../../libs/utils';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import type { IContextMenu } from '../../store/modules/contextMenu';

import type { TLangName } from '../../plugins/langs';

export default defineComponent({
    name: 'HeaderUserMenu',
    computed: {
        ...mapGetters(['getUser']),
        getProfileMenu(): IContextMenu {
            const userButtons = [
                { separator: true },
                {
                    label: 'Sessions',
                    icon: 'users',
                    click: () => {
                        this.$windows.create({
                            component: 'Sessions',
                            data: {
                                userId: this.getUser?._id,
                                token: ''
                            }
                        })
                    }
                },
                ...(!this.getUser?.isRegistered ? [
                    { separator: true },
                    {
                        label: this.$lang.params.global.sign.in,
                        icon: 'hand',
                        click: () => {
                            this.$windows.create({ title: this.$lang.params.user.create.title[0], component: 'Auth' });
                        }
                    },
                    {
                        label: this.$lang.params.user.create.title[0],
                        icon: 'user-circle',
                        click: () => {
                            this.$windows.create({ title: this.$lang.params.user.create.title[0], component: 'Auth', data: 'register' });
                        }
                    }
                ] : []),
                // ...(this.getUser?.isRegistered ? [
                //     { separator: true },
                //     {
                //         label: this.$lang.params.global.exit[1],
                //         icon: 'exit',
                //         class: 'exit',
                //         click: async () => {
                //             const [user, status, props] = await Users.me('exit');

                //             if (status !== 200) return;

                //             deleteCookie(['HX_AT', 'HX_RT']);

                //             if (props?.token?.guast) setCookie('HX_GUAST', props?.token?.guast, { days: 365 });

                //             this.setUser(user);
                //         }
                //     }
                // ] : [])
            ];

            return {
                name: 'header:profile:menu',
                buttons: [
                    {
                        label: this.$lang.params.global.settings,
                        icon: 'settings',
                        click: () => {
                            this.$windows.create({ title: 'Setting', component: 'Setting' });
                        }
                    },
                    {
                        label: this.$lang.params.global.theme.dark,
                        icon: 'sun-moon',
                        value: this.$local.params?.theme === 'dark',
                        checkbox: (value: boolean) => {
                            let theme = this.$local.params?.theme === 'dark' ? 'light' : 'dark';
                            
                            this.$local.set('theme', theme);
                            document.querySelector('html')?.setAttribute('theme', theme);
                        }
                    },
                    {
                        label: this.$lang.params.global.lang[1],
                        icon: 'translate',
                        // @ts-ignore
                        text: `${this.$lang.lang.name} (Beta)`,
                        children: {
                            name: 'header:lang',
                            title: this.$lang.params.global.lang[1],
                            buttons: Object.keys(this.$lang.list).map(key => ({
                                label: this.$lang.list[key as TLangName].name,
                                text:  this.$lang.name === key ? 'Used' : this.$lang.list[key as TLangName][this.$lang.name],
                                icon: 'translate',
                                click: () => {
                                    this.$lang.set(key as TLangName);
                            
                                    this.$local.set('lang', key);
                                    document.querySelector('html')?.setAttribute('lang', key);
                                }
                            }))
                        }
                    },
                    ...(this.getUser?._id ? userButtons : [])
                ]
            } as IContextMenu;
        }
    },
    // props: {},
    data: () => ({
        active: false
    }),
    watch: {},
    methods: {
        open(e: Event, ref: string, callbackTrue: Function = () => {}, callbackFalse: Function = () => {}) {
            callbackTrue();

            let close = () => {
                window.addEventListener('click', (e) => {
                    if ((this.$refs[ref] as any)?.contains(e.target)) return close();
                    
                    callbackFalse();
                }, { once: true });
            }

            setTimeout(() => close(), 10);
        },
    },
    mounted() {}
})

</script>

<style lang="scss" scoped>

.account {
    margin: 0 24px 0 0;
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
            border-radius: 5px;
            // backdrop-filter: blur(5px);
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
        position: relative;
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
            background-color: var(--color);
            background-image: var(--image);
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
        align-items: center;
        justify-content: center;

        &:not(.a-loading) {
            border-radius: 10px;
            transform: rotate(25deg);
            transition: .2s;
            overflow: hidden;
        }

        &:not(.a-loading):hover {
            border-radius: 50%;
            transform: rotate(0) scale(1.3);

            div {
                transform: rotate(0);
            }
        }

        &:not(.a-loading) div {
            width: 120%;
            height: 120%;
            position: absolute;
            background-size: cover;
            background-color: var(--background-secondary);
            background-image: var(--avatar);
            background-position: 50% 50%;
            transform: rotate(-25deg);
            transition: .2s;
        }
    }

    .level {
        margin: 12px 0;
        position: relative;

        .bar {
            $bg: linear-gradient(var(--main-color), var(--main-color));
            $bg-2: linear-gradient(var(--main-color-alt), var(--main-color-alt));

            width: 100%;
            height: 8px;
            position: relative;
            border-radius: 5px;
            background: $bg, $bg-2;
            background-size: var(--p) 8px, calc(100% - var(--p)) 8px;
            background-repeat: no-repeat, no-repeat;
            background-position: left top, right top;
            box-sizing: border-box;
            animation: BackgroundShow .2s ease-in-out;
            transition: .2s;

            @keyframes BackgroundShow {
                from {
                    background-size: 0px 8px, 0% 8px;
                }
            }
        }

        .text {
            display: flex;
            margin: 2px 0 0 0;
            padding: 0 4px;
            align-items: center;
            justify-content: space-between;
            animation: TextShow .3s ease-in-out;
            box-sizing: border-box;

            span {
                color: var(--text-secondary);
                font-size: 12px;
            }

            @keyframes TextShow {
                from {
                    transform: translateY(50%);
                    opacity: 0;
                }
            }
        }
    }
}

</style>