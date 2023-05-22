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
            <div class="logo">
                <RouterLink to="/"
                    @contextmenu="getUser?.permissions?.includes(EPermissions.Site) ? setContextMenu(getAdminContext) : null"
                >heito.xyz</RouterLink>
                <div class="online"
                    @click="open($event, 'online', () => getListOnlineUsers(online.isActive), () => online.isActive = false)"
                >
                    <span>Online:</span> {{ online.count }}
                </div>

                <Transition name="activities">
                    <ul class="blur" v-if="online.isActive">
                        <Loading v-show="online.list?.length < 1"/>
                        <User v-for="user of online.list" :key="user._id"
                            :user="user"
                        />
                    </ul>
                </Transition>
            </div>
            <div :class="['activities', { active: activities.isActive }]" ref="activities">
                <Transition name="activities">
                    <div class="data blur" v-if="activities?.list?.length > 0"
                        @click="open($event, 'activities', () => activities.isActive = true, () => activities.isActive = false)"
                    >
                        <Activity :show-buttons="activities.isActive" :content="activities.track ? activities.track : activities.list[0]"/>
    
                        <Transition name="fadeHeight">
                            <div class="list" v-if="activities.isActive && activities.list?.length > 1">
                                <ScrollBar :max-height="'256px'">
                                    <div>
                                        <Activity v-for="(activity, idx) in activities.list.slice(1)" :key="idx" :show-buttons="true"
                                            :content="activity"
                                        />
                                    </div>
                                </ScrollBar>
                            </div>
                        </Transition>
                    </div>
                </Transition>
            </div>
        </div>

        <div>
            <div :class="['search']"
                @click="search.isActive ? null : open($event, 'search', () => search.isActive = true, () => search.isActive = false)"
                @mouseenter="search.isActive ? null : setToolpic({ name: 'global-search', title: 'Search', position: 'bottom' })"
            >
                <Icon name="search-alt" v-if="!search.isActive"/>

                <Transition name="account-username">
                    <div v-if="search.isActive" ref="search">
                        <Textbox :label="'Search'" :autofocus="true"
                            @input="search.text = $event.target?.value; searchUsers()"
                        />
                        <div class="result blur">
                            <User v-for="user of search.users" :key="user._id" :user="user"/>
                        </div>
                    </div>
                </Transition>
            </div>

            <div :class="['tabs']" :data-count="getBroadcastWindows.length" v-if="getBroadcastWindows.length > 1"
                @click="open($event, 'tabs', () => tabs = true, () => tabs = false)"
            >
                <Icon name="layers"/>

                <Transition name="tabs">
                    <ul class="blur" ref="tabs" v-if="tabs">
                        <li v-for="window of getBroadcastWindows" :key="window"
                            :style="{ '--color': createHex() }"
                            @click="sendBroadcastMessage({ cmd: 'focus', to: window.id })"
                        >
                            <div class="image"></div>
                            <div>
                                <div>{{ window.id }}</div>
                                <div>{{ timeago(window.createdAt) }}</div>
                            </div>
                        </li>
                    </ul>
                </Transition>
            </div>

            <div :class="['notifications', { 'new-message': getListNotifications.filter((n: any) => !n?.hide)?.length > 0 }]"
                @click="setActiveNotifications(!getActiveNotifications)"
                @mouseenter="setToolpic({ name: 'notification', title: getLang.global.notification[0], position: 'bottom' })"
            >
                <Icon name="notification"/>
            </div>

            <div :class="['account', { active: menu }]" ref="account">
                <div class="data blur">
                    <div class="header" :style="{ '--color': getUser?.color || 'var(--main-color)' }"
                        @click="menu ? createWindow({ component: 'User', data: getUser?._id }) : false"
                    >
                        <Transition name="account-username">
                            <div class="username" v-show="menu">{{ getUser?.nickname || getUser?.username || getUser?._id || 'Guest' }}</div>
                        </Transition>
                        <div class="avatar"
                            @click.prevent.stop="menu ? createWindow({ component: 'User', data: getUser?._id }) : open($event, 'account', () => menu = true, () => menu = false)"
                        >
                            <div :style="{ '--avatar': `url('${getAvatar({ nameId: getUser?._id })}')` }"></div>
                        </div>
                    </div>
                    <!-- <div class="level" v-if="menu">
                        <div class="bar" :style="{ '--p': '90%' }"></div>
                        <div class="text">
                            <span>9 lvl</span>
                            <span>10 lvl</span>
                        </div>
                    </div> -->
                    <Transition name="account-menu">
                        <Menu :menu="getProfileMenu" style="margin: 12px 0 0 0;" v-if="menu"/>
                    </Transition>
                </div>
            </div>

            <div :class="['super', { active: superMenu }]">
                <div class="icon"
                    @click="superMenu = !superMenu; $emit('changeSuperMode', superMenu)"
                >
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">

import Menu from './content/Menu.vue';

import Activity, { type IContent } from './content/Activity.vue';

import ScrollBar from './ScrollBar.vue';

import Users, { EPermissions, type IUser } from '../libs/api/routes/users';
import User from './cards/User.vue';

import { getAvatar, timeago, createHex } from '../libs/functions';

</script>

<script lang="ts">

import { defineComponent, Ref } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import type { IContextMenu, IContextMenuButton } from '../store/modules/contextMenu';

import Langs from '../libs/langs';

type TTrack = {
    id?: string;
    name?: string;
    preview?: string;
    type?: string;
    image?: string;
    artists?: Array<{ id: string, name: string, type: string, url: string }>;
    url?: string;
    start?: number;
    end?: number;
}

interface IData {
    darkTheme: boolean;
    tabs: boolean;
    menu: boolean;
    search: {
        isActive: boolean;
        text: string;
        users: Array<IUser>;
    }
    online: {
        isActive: boolean;
        count: number;
        list: Array<IUser>;
    };
    activities: {
        isActive: boolean;
        track: IContent;
        list: IContent[];
    };
    superMenu: boolean;
}

export default defineComponent({
    name: 'MainHeader',
    components: {},
    computed: {
        ...mapGetters([
            'getLangName',
            'getLang',
            'getActiveNotifications',
            'getListNotifications',
            'getHeaderLoading',
            'getHeaderOptions',
            'getUser',
            'getBroadcastWindows',
            'getSocket'
        ]),
        getProfileMenu(): IContextMenu {
            return {
                name: 'header:profile:menu',
                buttons: [
                    {
                        label: this.getLang.global.settings,
                        icon: 'settings',
                        click: () => {
                            this.createWindow({ title: 'Setting', component: 'Setting' });
                        }
                    },
                    {
                        label: this.getLang.global.theme.dark,
                        icon: 'sun-moon',
                        value: this.$local.params?.theme === 'dark',
                        checkbox: (value: boolean) => {
                            let theme = this.$local.params?.theme === 'dark' ? 'light' : 'dark';
                            
                            this.$local.set('theme', theme);
                            document.querySelector('html')?.setAttribute('theme', theme);
                        }
                    },
                    {
                        label: this.getLang.global.lang[1],
                        icon: 'translate',
                        // @ts-ignore
                        text: `${Langs[this.getLangName]['en'] || Langs[this.getLangName].name} (Beta)`,
                        children: {
                            name: 'header:lang',
                            title: this.getLang.global.lang[1],
                            buttons: Object.keys(Langs).map((key: any) => ({
                                // @ts-ignore
                                label: Langs[key][this.getLangName] || Langs[key].name,
                                text:  this.getLangName === key ? 'Used' : '',
                                icon: 'translate',
                                click: () => {
                                    this.setLang(key);
                            
                                    this.$local.set('lang', key);
                                    document.querySelector('html')?.setAttribute('lang', key);
                                }
                            }))
                        }
                    },
                    ...(!this.getUser?.isRegistered ? [
                        { separator: true },
                        {
                            label: this.getLang.global.sign.in,
                            icon: 'hand',
                            click: () => {
                                this.createWindow({ title: this.getLang.user.create.title[0], component: 'Auth' });
                            }
                        },
                        {
                            label: this.getLang.user.create.title[0],
                            icon: 'user-circle',
                            click: () => {
                                this.createWindow({ title: this.getLang.user.create.title[0], component: 'Auth', data: 'register' });
                            }
                        },
                        { separator: true },
                        {
                            label: this.getLang.global.exit[1],
                            icon: 'exit',
                            class: 'exit'
                        }
                    ] : [])
                ]
            } as IContextMenu;
        },
        getAdminContext(): IContextMenu {
            return {
                name: 'admin:menu',
                event: (this.$el as Element)?.querySelector('.logo .online') as any,
                position: ['center', 'fixed-target', 'bottom'],
                buttons: [
                    {
                        label: 'Configs',
                        icon: 'configs',
                        click: () => {
                            this.createWindow({ component: 'Configs' });
                        }
                    }
                ]
            }
        }
    },
    data(): IData {
        return {
            darkTheme: true,
            tabs: false,
            activities: {
                isActive: false,
                track: {} as IContent,
                list: []
            },
            menu: false,
            online: {
                isActive: false,
                count: 0,
                list: []
            },
            search: {
                isActive: false,
                text: '',
                users: []
            },
            superMenu: false
        }
    },
    watch: {},
    sockets: {
        'users:online'(data) {
            if (data?.online) {
                this.online.count = data?.online;
            } else if (data?.list) {
                this.online.list = data?.list as IUser[];
            }
        },
        'activities:track:playing'(data: { userId: string, track: TTrack, is_playing: boolean }) {
            if (!data.is_playing) return;

            this.activities.track = {
                id: 'spotify:track',
                type: 'mini',
                name: data?.track?.name as string,
                largeImage: {
                    url: data?.track?.image as string
                },
                progressBar: {
                    value: data?.track?.start,
                    end: data?.track?.end,
                    isTime: true
                },
                buttons: [
                    { label: 'Profile', icon: 'user-circle', url: `https://open.spotify.com/user/${data?.userId}` },
                    { label: 'Open track', icon: 'music-note', url: data?.track?.url }
                ]
            }
        },
        'activities:list'(activitiesList: Array<{ type: 'steam' | 'github' | 'tetr', [key: string]: any }>) {
            this.activities.list = [];
            for (let active of activitiesList) {
                let activity: IContent = { name: 'Activity', type: 'default' };

                switch(active?.type) {
                    case 'steam':
                        let isGame = active?.game?.id,
                            steamStatus = [
                                { label: 'Offline', icon: 'circle-alt', color: 'var(--text-secondary)' }, 
                                { label: 'Online', icon: 'circle', color: 'var(--green)' }, 
                                { label: 'Busy', icon: 'quill', color: 'var(--background-secondsry-alt)' }, 
                                { label: 'Away', icon: 'pacman', color: 'var(--blue)' }, 
                                { label: 'Snooze', icon: 'clock', color: 'var(--yellow)' }, 
                                { label: 'Looking to trade', icon: '', color: '' }, 
                                { label: 'Looking to play', icon: 'play', color: 'var(--green)' }
                            ],
                            status = steamStatus[active?.status];

                        activity = {
                            id: `steam:${active?.id}`,
                            name: active?.name,
                            details: isGame ? `Playing` : (active?.realname ? `Realname: ${active?.realname}` : undefined),
                            state: isGame ? status.label : undefined,
                            type: isGame ? 'default' : 'mini',
                            largeImage: {
                                url: isGame ? active?.game?.capsule : active?.avatar,
                                label: isGame ? active?.game?.name : 'Steam'
                            },
                            smallImage: isGame ? {
                                url: active?.avatar,
                                label: 'Steam'
                            } : status,
                            buttons: [
                                { label: 'Profile', icon: 'user-circle', url: active?.url }
                            ]
                        };

                        if (isGame) activity['buttons']?.push({ label: 'Game', icon: 'brush', url: active?.game?.store });
                        break;
                    case 'github':
                        activity = {
                            id: `github:${active?.id}`,
                            name: `${active?.name} (${active?.login})`,
                            details: `Followers: ${active?.followers}`,
                            state: `Public repos: ${active?.public_repos}`,
                            largeImage: {
                                url: active?.avatar_url,
                                label: 'GitHub'
                            },
                            type: 'default',
                            buttons: [
                                { label: 'Profile', icon: 'user-circle', url: active?.html_url }
                            ]
                        };

                        if (active?.blog) activity['buttons']?.push({ label: 'WebSite', icon: 'link', url: active?.blog });
                        break;
                    case 'tetr':
                        activity = {
                            id: `tetr:${active?._id}`,
                            name: `${active?.username}`,
                            details: `${active?.xp} XP`,
                            state: `Tetra league: ${Number(active?.league?.rating).toFixed(2)} TR`,
                            largeImage: {
                                url: active?.avatar_url,
                                label: 'Tetr.io'
                            },
                            // smallImage: {
                            //     url: active?.country_flag,
                            //     label: active?.country
                            // },
                            type: 'default',
                            buttons: [
                                { label: 'Profile', icon: 'user-circle', url: `https://ch.tetr.io/u/${active?.username}` }
                            ]
                        };

                        if (active?.blog) activity['buttons']?.push({ label: 'WebSite', icon: 'link', url: active?.blog });
                        break;
                }

                this.activities.list = [...this.activities.list || [], activity];
            }

        }
    },
    methods: {
        ...mapActions(['setLang', 'setActiveNotifications', 'setToolpic', 'createWindow', 'sendBroadcastMessage', 'setContextMenu']),
        log(e: any) {
            console.log(e);
        },
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
        getListOnlineUsers(boolean: boolean) {
            this.online.isActive = !boolean;

            if (boolean || this.online.list?.length > 1) return;

            this.$socket.emit('users:online', 'list');
        },
        async searchUsers() {
            let [result, status] = await Users.list();

            if (status !== 200) return;

            this.search.users = (result as any).results;
        }
    },
    mounted() {
        this.darkTheme = this.$local.get('theme') === 'dark';

        // this.$socket.emit('users:online', 'count');
    }
});

</script>

<style lang="scss" scoped>

// @keyframes Height {
//     from {
//         max-height: 0px;
//         height: 0px;
//         opacity: 0;
//     }
//     to {
//         max-height: 256px;
//     }
// }

// .height-enter-active {
//     animation: Height .2s linear;
// }

// .height-leave-active {
//     animation: Height .2s linear reverse;
// }

.fadeHeight-enter-active,
.fadeHeight-leave-active {
    transition: all 0.2s;
    max-height: 230px;
    margin: 0;
}
.fadeHeight-enter,
.fadeHeight-leave-to
{
    opacity: 0;
    max-height: 0px;
    margin: 0;
}

.account-menu-enter-active,
.account-menu-leave-active {
    transform: scale(0.8);
    opacity: 0;
}

.activities-enter-active,
.activities-leave-active {
    transform: translateY(-32px);
    opacity: 0;
}

.tabs-enter-active,
.tabs-leave-active {
    transform: translateX(-50%) scale(0.8);
    transform-origin: top center;
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
            background-color: var(--main-color);
            transition: .2s;
        }
    }

    .left {
        display: flex;
        align-items: center;
        
        .logo {
            position: relative;

            a {
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

            .online {
                cursor: pointer;
                position: relative;
                color: var(--main-color);
                font-size: 14px;
                user-select: none;
                
                span {
                    color: var(--text-secondary);
                    font-size: 12px;
                }
            }

            ul {
                padding: 12px;
                max-width: 256px;
                min-width: 256px;
                position: absolute;
                top: calc(100% + 8px);
                left: -12px;
                border-radius: 5px;
                border: 1px solid var(--background-secondary);
                transition: .2s;
                overflow: hidden;
            }
        }

        .activities {
            margin: 0 0 0 32px;
            height: 42px;
            position: relative;

            &.active {
                .data {
                    padding: 12px;
                    top: calc(50% - 24px);
                    left: -12px;
                    border-color: var(--background-secondary);
                }
            }

            .data {
                cursor: pointer;
                max-width: 256px;
                min-width: 256px;
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 5px;
                border: 1px solid var(--T);
                transition: .3s;
    
                .list {
                    margin: 12px 0 0 0;
                    padding: 12px 0 0 0;
                    border-top: 1px solid var(--background-secondary);

                    .activity {
                        margin: 0 0 12px 0;

                        &:last-child {
                            margin: 0;
                        }
                    }
                }
            }

        }
    }

    .left + div {
        display: flex;
        align-items: center;
        justify-content: center;

        .search,
        .tabs,
        .notifications {
            cursor: pointer;
            margin: 0 12px 0 0;
            transition: .2s;
        }

        .search {
            cursor: default;
            min-width: 16px;
            min-height: 16px;
            position: relative;

            .hx-icon {
                cursor: pointer;
            }

            .result {
                min-width: 100%;
                padding: 12px;
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                border-radius: 5px;
                border: 1px solid var(--background-secondary);
            }
        }

        .tabs {
            cursor: pointer;
            position: relative;
            transform: translateY(1px);
            z-index: 2;

            .hx-icon {
                cursor: pointer;
            }

            &::after {
                content: attr(data-count);
                width: 12px;
                height: 12px;
                position: absolute;
                top: -6px;
                right: -6px;
                font-size: 10px;
                text-align: center;
                line-height: 12px;
                border-radius: 5px;
                background: var(--background-secondary);
            }

            ul {
                padding: 8px;
                min-width: 169px;
                position: absolute;
                top: calc(100% + 16px);
                left: 50%;
                border-radius: 5px;
                border: 1px solid var(--background-secondary);
                transform: translateX(-50%);
                transition: .2s;

                li {
                    cursor: pointer;
                    display: flex;
                    margin: 0 0 8px 0;
                    align-items: center;

                    &:last-child {
                        margin: 0;
                    }

                    .image {
                        margin: 0 8px 0 0;
                        width: 32px;
                        height: 32px;
                        border-radius: 5px;
                        background-color: var(--color);
                    }

                    .image + div {
                        max-width: 100%;

                        div {
                            max-width: 100%;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }

                        div:nth-child(2) {
                            color: var(--text-secondary);
                            font-size: 12px;
                        }
                    }
                }
            }
        }

        .notifications {
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
                background-color: var(--main-color);
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
                    padding: 16px 8px;
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
                    // background-image: url('https://avatars.mds.yandex.net/i?id=b5ed82d65587a3cd0a6818c4c02c16e15c046b92-8497600-images-thumbs&n=13');
                    background-color: var(--color);
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
                    border-radius: 50%;
                    transform: rotate(0) scale(1.3);
                    // box-shadow: 0 0 0 2px var(--background-secondary);

                    div {
                        transform: rotate(0);
                    }
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

        .super {
            position: relative;

            .icon {
                cursor: pointer;
                display: flex;
                width: 16px;
                min-height: 13px;
                align-items: center;
                justify-content: space-between;
                flex-direction: column;
                transition: .2s;

                &:hover {
                    div {
                        background-color: var(--text-primary);
                    }
                }

                div {
                    width: 100%;
                    min-height: 1px;
                    border-radius: 5px;
                    background-color: var(--text-secondary);
                    transition: .2s;
                }
            }

            &.active {
                .icon {
                    div {
                        width: 70%;
                        background-color: var(--main-color);

                        &:nth-child(1) {
                            transform: rotate(-45deg) translate(-25%, -1px);
                        }

                        &:nth-child(2) {
                            opacity: 0;
                        }

                        &:nth-child(3) {
                            transform: rotate(45deg) translate(-25%, 0px);
                        }
                    }
                }
            }
        }
    }
}

</style>