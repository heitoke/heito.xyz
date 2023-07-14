<template>
    <header :style="{
        'backdrop-filter': header.getOptions.blur.enable ? `blur(${header.getOptions.blur.value})` : '' }"
    >
        <Transition name="loading">
            <div class="loading" v-show="header.getLoading.process > 0 && header.getLoading.process < 100">
                <div :style="{ width: `${header.getLoading.process}%`, background: header.getLoading.color }"></div>
            </div>
        </Transition>

        <div class="left">
            <div class="logo">
                <Icon name="logo" style="color: var(--main-color); font-size: 32px;"/>

                <div style="margin: 0 0 0 12px;">
                    <RouterLink to="/"
                        @contextmenu="user.getPer(EPermissions.Site) ? contextMenu.create(getAdminContext) : null"
                    >heito.xyz</RouterLink>

                    <div class="online" v-if="config.getStatus === 'online'"
                        @click="open($event, _online, () => getListOnlineUsers(online.isActive), () => online.isActive = false)"
                    >
                        <span>Online:</span> {{ online.count }}
                    </div>
                </div>

                <Transition name="activities">
                    <ul class="blur" ref="_online" v-if="online.isActive">
                        <Loading v-show="online.list?.length < 1"/>

                        <User v-for="user of online.list" :key="user._id"
                            :user="user"
                        />
                    </ul>
                </Transition>
            </div>

            <Activities/>
        </div>

        <div>
            <div :class="['search']" v-if="config.getStatus === 'online'"
                @click="search.isActive ? null : open($event, _search, () => search.isActive = true, () => search.isActive = false)"
                @mouseenter="search.isActive ? null : toolpics.set({ title: 'Search', position: 'bottom' })"
            >
                <Icon name="search-alt" v-if="!search.isActive"/>

                <Transition name="account-username">
                    <div v-if="search.isActive" ref="_search">
                        <Textbox :label="'Search'" :autofocus="true"
                            @input="search.text = $event.target?.value; searchUsers()"
                        />

                        <!-- <div class="result blur">
                            <ScrollBar :max-height="'50vh'">
                                <User v-for="user of search.users" :key="user._id" :user="user"/>
                            </ScrollBar>
                        </div> -->
                    </div>
                </Transition>
            </div>

            <!-- <div :class="['tabs']" :data-count="getBroadcastWindows.length" v-if="getBroadcastWindows.length > 1"
                @click="open($event, 'tabs', () => tabs = true, () => tabs = false)"
            >
                <Icon name="layers"/>

                <Transition name="tabs">
                    <ul class="blur" ref="_tabs" v-if="tabs">
                        <li v-for="window of getBroadcastWindows" :key="window"
                            :style="{ '--color': colors.createHex() }"
                            @click="sendBroadcastMessage({ cmd: 'focus', to: window.id })"
                        >
                            <div class="image"></div>
                            <div>
                                <div>{{ window.id }}</div>
                                <div>{{ time.timeago(window.createdAt) }}</div>
                            </div>
                        </li>
                    </ul>
                </Transition>
            </div> -->

            <div :class="['notifications', { 'new-message': notifications.getList?.filter((n: any) => !n?.hide)?.length > 0 }]"
                @click="notifications.setActive(!notifications.getActive)"
                @mouseenter="toolpics.set({ name: 'notification', title: 'Notifications', position: 'bottom' })"
            >
                <Icon name="notification"/>
            </div>

            <UserMenu/>

            <div :class="['super', { active: superMenu }]">
                <div class="icon"
                    @click="superMenu = !superMenu; emit('changeSuperMode', superMenu)"
                >
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>

import Activities from './Activities.vue';
import UserMenu from './UserMenu.vue';

import ScrollBar from '~/components/content/ScrollBar.vue';

import User from '~/components/models/user/Card.vue';

import { useHeaderStore } from '~/stores/header';

import { IContextMenu } from '~/types/stores/contextMenu';
import { type IUser, EPermissions } from '~/types/api/user';

const { $api, $local, $socket } = useNuxtApp();

const
    header = useHeaderStore(),
    user = useUserStore(),
    toolpics = useToolpicsStore(),
    contextMenu = useContextMenusStore(),
    notifications = useNotificationsStore(),
    windows = useWindowsStore(),
    config = useConfigStore();

const
    root = ref<HTMLElement | null>(null),
    _online = ref<HTMLElement | null>(null),
    _search = ref<HTMLElement | null>(null),
    _tabs = ref<HTMLElement | null>(null);

const emit = defineEmits(['changeSuperMode']);


const
    darkTheme = ref<boolean>(true),
    tabs = ref<boolean>(false),
    online = ref({
        isActive: false,
        count: 0,
        list: [] as Array<IUser>,
        lastedAt: 0
    }),
    search = ref({
        isActive: false,
        text: '',
        users: []
    }),
    superMenu = ref<boolean>(false);

const getAdminContext = computed(() => {
    return {
        name: 'admin:menu',
        event: root.value?.querySelector('.logo .online') as any,
        position: ['center', 'fixed-target', 'bottom'],
        buttons: [
            {
                label: 'Configs',
                icon: 'configs',
                click: () => {
                    windows.create({ component: 'AdminConfigsList' });
                }
            }
        ]
    } as IContextMenu
});



$socket.on('users:online', data => {
    if (data?.list?.length! > 0) {
        online.value.list = data?.list || [];
    }

    online.value.count = data?.online || data?.list?.length || 1;
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

function getListOnlineUsers(boolean: boolean) {
    online.value.isActive = !boolean;

    if (boolean || online.value.list?.length > 1 || Date.now() < (online.value.lastedAt + 10000)) return;

    online.value.lastedAt = Date.now();

    $socket.emit('users:online', 'list');
}

async function searchUsers() {
    const [result, status] = await $api.users.list();

    if (status !== 200) return notifications.error({
        title: 'search users',
        message: (result as any)?.message,
        status
    });

    search.value.users = (result as any).results;
}


onMounted(() => {
    darkTheme.value = $local.get('theme') === 'dark';
});

</script>

<style lang="scss" scoped>

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
            display: flex;
            position: relative;
            align-items: center;
            justify-content: center;

            .l {
                margin: 0 12px 0 0;
                min-width: 20px;
                height: 27px;
                transition: .2s;
                user-select: none;

                span {
                    position: absolute;
                    color: var(--main-color);
                    font-size: 20px;
                    font-weight: 900;
                    font-family: sans-serif;

                    &:nth-child(1) {
                        // color: var(--green);
                        transform: rotate(49deg) translate(-5.7px, 2.7px);
                    }
                    &:nth-child(2) {
                        // color: var(--red);
                        transform: translateX(-4px);
                    }
                    &:nth-child(3) {
                        // color: var(--blue);
                        transform: translateX(-2px);
                    }
                }
            }

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