<template>
    <div class="notifications" ref="root">
        <Transition name="bg">
            <div class="bg" v-if="notifications.getActive" @click="notifications.setActive(false)"></div>
        </Transition>

        <Transition name="panel">
            <div class="panel" v-if="notifications.getActive">
                <header>
                    <span>Notifications</span>
                    <Icon name="close" @click="notifications.setActive(false)"/>
                </header>

                <ScrollBar max-height="calc(100vh - 48px)">
                    <ul class="list menu" v-if="notifications.getList.length > 0">
                        <Notification v-for="(notification, idx) of getListNotifications" :key="notification.id"
                            :id="notification.id"
                            :notification="notification"
                            :showButtons="true"
                            @contextmenu="notificationContextMenu(idx, notification.id!)"
                        />
                    </ul>

                    <Alert style="margin: 12px 12px 0 12px;" type="mini" v-else/>
                </ScrollBar>
            </div>
        </Transition>

        <ul :class="['list global', notifications.getPosition, { active: !notifications.getActive }]">
            <TransitionGroup name="notification" @enter="enterNotification">
                <Notification v-for="notification of notifications.getList.filter(n => !n.hide).slice(0, getMaxCountNotification)" :key="notification.id"
                    style="cursor: pointer;"
                    :id="notification.id"
                    :style="{ 'transform-origin': notifications.getPosition }"
                    :notification="notification"
                    @click="notifications.setActive(true)"
                />
            </TransitionGroup>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import { defineComponent } from 'vue';

import { useUserStore } from '~/stores/user';

import ScrollBar from '~/components/content/ScrollBar.vue';

import Notification from './Notification.vue';

import { type ILog, codes } from '~/types/api/log';
import type { INotification, INotificationButton } from '~/types/stores/notifications';

const { $api } = useNuxtApp();

const root = ref<HTMLElement | null>(null);

const
    user = useUserStore(),
    notifications = useNotificationsStore(),
    contextMenus = useContextMenusStore(),
    windows = useWindowsStore();

const getMaxCountNotification = computed<number>(() => {
    const count: number = Math.floor(window.innerHeight / 70) - 2;

    return count > 7 ? 7 : count;
});

const getListNotifications = computed(() => {
    return notifications.getList.sort((a, b) => a?.createdAt! < b?.createdAt! ? 1 : -1);
});

watch(() => user.getUser._id, (newValue: string) => {
    if (!newValue) return;

    loadUserNotifications(newValue);
});

// 'notifications:push'(notification: ILog) {
//     this.$notifications.push(this.getNotification(notification));
// }

function enterNotification(el: Element) {
    setTimeout(() => {
        notifications.hide(Number(el.id));
    }, 7000);
}


function getNotification(notification: ILog): INotification {
    const code = codes[notification.code];

    let message = '';

    let buttons: Array<INotificationButton> = [];

    const id = Math.random();

    switch(notification.code) {
        case 202:
            message = `In ${notification?.props?.project}`;

            buttons = [
                ...['accept', 'refuse'].map(x => ({
                    label: x[0].toLocaleUpperCase() + x.slice(1),
                    click: async () => {
                        const [result, status] = await $api.projects.action(notification?.props?.project, 'invate', x);

                        if (status !== 200) return;

                        notifications.push({
                            title: 'Project action',
                            message: 'Everything went well',
                            color: 'var(--green)'
                        });

                        notifications.remove(id);
                    }
                })),
                {
                    label: 'Open project',
                    icon: 'image',
                    click: () => {
                        windows.create({ component: 'ProjectProfile', data: notification.props?.project });
                    }
                }
            ];
            break;
        case 203:
            message = `From ${notification?.props?.project}`;
            break;
        case 205: case 206:
            message = `User ${notification.props?.member}`;

            buttons = [
                {
                    label: 'User profile',
                    icon: 'user-circle',
                    click: () => {
                        windows.create({ component: 'UserProfile', data: notification.props?.member });
                    }
                },
                {
                    label: 'Project',
                    icon: 'image',
                    click: () => {
                        windows.create({ component: 'ProjectProfile', data: notification.props?.project });
                    }
                }
            ];
            break;
    }

    return {
        id,
        title: code.text,
        message,
        color: code.color || 'var(--main-color)',
        icon: code.icon || 'pacman',
        shadowPosition: 'left',
        shadow: true,
        buttons,
        createdAt: new Date(notification.createdAt).getTime()
    }
}

function notificationContextMenu(idx: number, notificationId: number) {
    contextMenus.create({
        name: `notifications:${idx}`,
        position: ['left', 'fixed-target'],
        event: root.value?.querySelector(`.panel .list.menu .notification:nth-child(${idx + 1})`)!,
        buttons: [
            {
                label: 'Delete',
                icon: 'trash',
                color: 'var(--red)',
                click: async () => {
                    notifications.remove(notificationId)
                }
            }
        ]
    })
}

async function loadUserNotifications(userId: string) {
    if (!userId) return;

    const [result, status] = await $api.users.notifications(userId);

    if (status !== 200 || result.results.length < 1) return;

    const listNotifications: Array<INotification> = result.results.map(n => getNotification(n));

    notifications.addNotifications(listNotifications, true);

    notifications.push({
        title: 'Notifications',
        icon: 'notification',
        message: `You have ${result.count} notifications`,
        color: 'var(--main-color)'
    });
}


onMounted(() => {
    notifications.push({
        title: 'Hello',
        color: 'var(--blue)',
        icon: 'pacman',
        message: 'Lorem text',
        buttons: [
            {
                icon: 'pacman',
                label: 'Hello world',
                color: 'var(--main-color)'
            },
            {
                icon: 'git',
                label: 'Git'
            }
        ]
    });
});

</script>

<style lang="scss" scoped>

.notification-enter-active,
.notification-leave-active {
    transform: scale(0.8);
    opacity: 0;
}

.notifications {
    position: relative;
    z-index: 106;

    .bg {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #00000055;
        transition: .3s;

        &-enter-active,
        &-leave-active {
            opacity: 0;
        }
    }

    .panel {
        width: 376px;
        height: 100vh;
        position: absolute;
        top: 0;
        right: 0;
        border-left: 1px solid var(--background-secondary);
        backdrop-filter: blur(10px);
        transition: .3s;

        &::before {
            content: " ";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: var(--background-secondary);
            opacity: .5;
            z-index: -1;
        }

        &-enter-active,
        &-leave-active {
            right: -25%;
            opacity: 0;
        }
    }

    header {
        display: flex;
        margin: 0 12px;
        padding: 12px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--background-secondary-alt);
        box-sizing: border-box;

        span {
            font-size: 20px;
        }

        i.i-close {
            cursor: pointer;
            color: var(--red);
            font-size: 18px;
        }
    }

    .list {
        pointer-events: none;
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-sizing: border-box;
        transition: .2s;

        &.menu {
            padding: 8px 24px;
            max-width: 100%;
            max-height: 100%;
            overflow-x: hidden;

            .notification {
                width: 100%;
            }
        }

        &.global {
            padding: 64px;
            position: fixed;
            width: 100vw;
            height: 100vh;
            transform: scale(.8);
            opacity: 0;
            z-index: -1;
            
            &.active {
                transform: scale(1);
                opacity: 1;
                z-index: 1;
            }
        }

        .notification {
            margin: 0 0 8px 0;
            transition: .2s;

            &:last-child {
                margin: 0;
            }
        }

        &.top {
            justify-content: flex-start;
        }
        &.bottom {
            justify-content: flex-end;
        }
        &.left {
            align-items: flex-start;
        }
        &.right {
            align-items: flex-end;
        }
    }

    @media (max-width: 740px) {
        .panel {
            width: 100vw;
        }
    }
}

</style>