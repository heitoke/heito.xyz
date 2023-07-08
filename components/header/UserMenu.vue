<template>
    <div :class="['account', { active }]" ref="root">
        <div :class="['data', { blur: active }]">
            <div class="header"
                @click="active ? openProfile() : false"
                :style="{
                    padding: active ? `${user.getUser?.banner ? 20 : 16}px 8px` : undefined,
                    '--color': user.getUser?.color || 'var(--main-color)',
                    '--image': `url('${user.getUser?.banner || null}')`
                }"
            >
                <Transition name="account-username">
                    <div class="username" v-show="active"
                        :style="{
                            color: user.getUser?.color && !user.getUser?.banner ? colors.altColor(user.getUser?.color) : '#fff'
                        }"
                    >{{ user.getUser?.nickname || user.getUser?.username || user.getUser?._id || 'Guest' }}</div>
                </Transition>

                <div :class="['avatar', { 'a-loading': !user.getUser?._id }]"
                    @click.prevent.stop="active ? openProfile() : open($event, root, () => active = true, () => active = false)"
                >
                    <div :style="{ '--avatar': `url('${user.getUser?.avatar || getAvatar({ nameId: user.getUser?._id })}')` }" v-if="user.getUser?._id"></div>
                    
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

import { useI18n } from 'vue-i18n';
import Menu from '~/components/content/Menu.vue';

// import { mapActions, mapGetters } from 'vuex';

// import Users from '../../libs/api/routes/users';
// import Auth from '../../libs/api/routes/auth';

import type { IContextMenu } from '~/types/stores/contextMenu';

// import type { TLangName } from '../../plugins/langs';

const
    { $local, $langs } = useNuxtApp(),
    user = useUserStore(),
    windows = useWindowsStore(),
    { locale, t, availableLocales } = useI18n();

const root = ref<HTMLElement | null>(null);

const active = ref<boolean>(false);

const getProfileMenu = computed(() => {
    const userButtons = [
        { separator: true },
        {
            label: 'Sessions',
            icon: 'users',
            click: () => {
                // this.$windows.create({
                //     component: 'Sessions',
                //     data: {
                //         userId: user.getUser?._id,
                //         token: ''
                //     }
                // });
            }
        },
        { separator: true },
        ...(!user.getUser?.isRegistered ? [
            {
                label: t('global.sign.in'),
                icon: 'hand',
                click: () => {
                    // this.$windows.create({ title: this.$lang.params.user.create.title[0], component: 'Auth' });
                }
            },
            {
                label: t('user.create.title[0]'),
                icon: 'user-circle',
                click: () => {
                    // this.$windows.create({ title: this.$lang.params.user.create.title[0], component: 'Auth', data: 'register' });
                }
            }
        ] : [
            {
                label: t('global.exit[1]'),
                icon: 'exit',
                class: 'exit',
                click: async () => {
                    // const { windowId } = this.$windows.create({
                    //     component: 'Message',
                    //     data: {
                    //         title: 'Warning',
                    //         icon: 'info-circle',
                    //         text: 'When you log out of the account, the ip from which you are currently sitting will be deleted, you will have to log in again. Do you want to get out?',
                    //         buttons: [
                    //             {
                    //                 label: 'Bye Bye',
                    //                 color: 'var(--main-color)',
                    //                 click: async () => {
                    //                     const [result, logoutStatus] = await Auth.logout();

                    //                     if (logoutStatus !== 200) return;

                    //                     this.$notifications.push({
                    //                         title: 'Parting words',
                    //                         message: 'You are logged out',
                    //                         icon: 'exit',
                    //                         color: 'var(--yellow)'
                    //                     });

                    //                     const [user, status, props] = await Users.me('exit');

                    //                     if (status !== 200) return;

                    //                     cookies.delete(['HX_AT', 'HX_RT']);

                    //                     if (props?.token?.guast) cookies.set('HX_GUAST', props?.token?.guast, { days: 365 });

                    //                     this.setUser(user);

                    //                     this.$windows.close(windowId);
                    //                 }
                    //             },
                    //             {
                    //                 label: 'To stay',
                    //                 color: 'var(--green)',
                    //                 click: () => {
                    //                     this.$windows.close(windowId);
                    //                 }
                    //             }
                    //         ]
                    //     }
                    // });
                }
            }
        ])
    ];

    return {
        name: 'header:profile:menu',
        buttons: [
            {
                label: t('global.settings'),
                icon: 'settings',
                click: () => {
                    windows.create({ title: 'setting', component: 'Setting' });
                }
            },
            {
                label: t('global.theme.dark'),
                icon: 'sun-moon',
                value: $local.params?.theme === 'dark',
                checkbox: (value: boolean) => {
                    let theme = $local.params?.theme === 'dark' ? 'light' : 'dark';
                    
                    $local.set('theme', theme);
                    document.querySelector('html')?.setAttribute('theme', theme);
                }
            },
            {
                label: t('global.lang[1]'),
                icon: 'translate',
                // @ts-ignore
                text: `${$langs.list.find(l => l.code === locale.value).names[locale.value]} (Beta)`,
                children: {
                    name: 'header:lang',
                    title: t('global.lang[1]'),
                    buttons: $langs.list.map(lang => {
                        return {
                            // @ts-ignore
                            label: lang.names[locale.value],
                            // @ts-ignore
                            text: locale.value === lang.code ? 'Used' : lang.names[lang.code],
                            icon: 'translate',
                            click: () => {
                                locale.value = lang.code;

                                $local.set('lang', lang.code);
                                document.querySelector('html')?.setAttribute('lang', lang.code);
                            }
                        }
                    })
                }
            },
            ...(user.getUser?._id ? userButtons : [])
        ]
    } as IContextMenu;
});


function open(e: Event, ref: HTMLElement | null, callbackTrue: Function = () => {}, callbackFalse: Function = () => {}) {
    callbackTrue();

    let close = () => {
        window.addEventListener('click', (e) => {
            if (ref?.contains(e.target as any)) return close();
            
            callbackFalse();
        }, { once: true });
    }

    setTimeout(() => close(), 10);
}

function openProfile() {
    windows.create({
        component: 'User',
        data: user.getUser?._id
    });
}

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

    @media (max-width: 740px) {
        &.active {
            min-width: auto;

            .data {
                min-width: 196px;
                right: -64px;
            }
        }

        .data {
            z-index: 1;
        }
    }
}

</style>