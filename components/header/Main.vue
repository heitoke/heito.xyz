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
                        @contextmenu.prevent.stop="user.getPer(EPermissions.Site) ? contextMenu.create(getAdminContext) : null"
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
            <nav class="buttons" v-show="config.getStatus === 'online'">
                <li v-for="btn of buttons" :key="btn.icon"
                    :class="{ alert: btn?.alert }"
                    @click="btn?.click ? btn?.click($event) : null"
                    @mouseenter="toolpics.set({ text: btn.label, position: 'bottom' })"
                >
                    <Icon :name="btn.icon"/>
                </li>
            </nav>

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

import User from '~/components/models/user/Card.vue';

import { useHeaderStore } from '~/stores/header';

import { IContextMenu } from '~/types/stores/contextMenu';
import { type IUser, EPermissions } from '~/types/api/user';

interface Button {
    label: string;
    icon: string;
    alert?: boolean;
    click(event: MouseEvent): void;
}

const { $api, $local, $socket } = useNuxtApp();

const route = useRoute();

const
    header = useHeaderStore(),
    user = useUserStore(),
    toolpics = useToolpicsStore(),
    contextMenu = useContextMenuStore(),
    notifications = useNotificationsStore(),
    windows = useWindowsStore(),
    config = useConfigStore(),
    comments = usePageCommentsStore();

const
    root = ref<HTMLElement | null>(null),
    _online = ref<HTMLElement | null>(null),
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
    superMenu = ref<boolean>(false);

const buttons = ref<Array<Button>>([
    {
        label: 'Search',
        icon: 'search-alt',
        click: () => {
            windows.create({
                component: 'Search',
                position: 'top',
                close: {
                    enable: true,
                    button: false
                }
            });
        }
    },
    {
        label: 'Comments (Beta)',
        icon: 'comments-alt',
        click: (event) => {
            commentsContextMenu(event);
        }
    },
    {
        label: 'Notifications',
        icon: 'notification',
        alert: notifications.getList?.filter((n: any) => !n?.hide)?.length > 0,
        click: () => {
            notifications.setActive(!notifications.getActive);
        }
    }
]);

const getAdminContext = computed(() => {
    return {
        name: 'admin:menu',
        event: root.value?.querySelector('.logo .online') as any,
        position: ['center', 'fixed', 'bottom'],
        items: [
            {
                type: 'button',
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
        window.addEventListener('click', event => {
            const path = (event as any)?.path || (event.composedPath ? event.composedPath() : undefined);

            if (path && path.includes(ref)) return close();
            
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

function commentsContextMenu(event: MouseEvent) {
    const isVisible = comments.isVisible && comments.getUrl.includes(route.path);

    contextMenu.create({
        name: 'comments',
        event,
        items: [
            {
                type: 'button',
                label: (isVisible ? 'Hide' : 'Show') + ' comments',
                icon: 'comments-alt',
                text: 'On this page',
                click: async () => {
                    if (isVisible) {
                        return comments.setVisible(false);
                    }
                    
                    const [result, status] = await $api.comments.page(comments.getUrl, { skip: 0, limit: 32 });

                    if (status !== 200) return;

                    comments.setVisible(true);

                    comments.setComments(result.results);
                }
            },
            {
                type: 'button',
                label: 'Type of loading comments',
                children: {
                    name: 'comments:loading:type',
                    items: [
                        {
                            type: 'button',
                            label: 'By the button',
                            text: 'Recommended'
                        },
                        {
                            type: 'button',
                            label: 'When going to the page',
                        }
                    ]
                }
            },
            { type: 'separator' },
            {
                type: 'button',
                label: 'Create a comment',
                icon: 'comment',
                text: 'On this page',
                click: () => {
                    comments.setStatus('create');
                }
            }
        ] 
    });
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

        nav.buttons {
            display: flex;
            align-items: center;

            li {
                cursor: pointer;
                margin: 0 12px 0 0;
                min-width: 16px;
                min-height: 16px;
                transition: .2s;

                &.alert::after {
                    content: " ";
                    width: 8px;
                    height: 8px;
                    position: absolute;
                    top: -4px;
                    right: -2px;
                    border-radius: 2px;
                    background-color: var(--main-color);
                    transform: rotate(-45deg);
                    transition: .2s;
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