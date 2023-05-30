<template>
    <div class="notifications">
        <Transition name="bg">
            <div class="bg" v-if="$notifications?.options?.active" @click="$notifications.setActive(false)"></div>
        </Transition>

        <Transition name="panel">
            <div class="panel" v-if="$notifications?.options?.active">
                <header>
                    <span>Notifications</span>
                    <Icon name="close" @click="$notifications.setActive(false)"/>
                </header>

                <ScrollBar max-height="calc(100vh - 48px)">
                    <ul class="list menu" v-if="$notifications.list.length > 0">
                        <Notification v-for="notification of $notifications.list.sort((a, b) => a?.createdAt! < b?.createdAt! ? 1 : -1)" :key="notification.id"
                            :id="notification.id"
                            :notification="notification"
                            :showButtons="true"
                        />
                    </ul>
                    <Alert style="margin: 12px 12px 0 12px;" type="mini" v-else/>
                </ScrollBar>
            </div>
        </Transition>

        <ul :class="['list global', $notifications?.options?.position, { active: !$notifications?.options?.active }]">
            <TransitionGroup name="notification" @enter="enterNotification($event)">
                <Notification v-for="notification of $notifications?.list.filter(n => !n.hide).slice(0, getMaxCountNotification)" :key="notification.id"
                    :id="notification.id"
                    :style="{ 'transform-origin': $notifications?.options?.position }"
                    :notification="notification"
                />
            </TransitionGroup>
        </ul>
    </div>
</template>

<script setup lang="ts">

import ScrollBar from '../content/ScrollBar.vue';

import Notification from './Notification.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

import Users from '../../libs/api/routes/users';
import Projects from '../../libs/api/routes/projects';
import { ILog, codes } from '../../libs/api/routes/logs';

import { INotification, INotificationButton } from '../../plugins/notifications';

export default defineComponent({
    name: 'Notifications',
    components: {},
    computed: {
        ...mapGetters(['getWinHeight', 'getUser']),
        getMaxCountNotification(): number {
            const count: number = Math.floor(this.getWinHeight / 70) - 2;
            return count > 7 ? 7 : count;
        }
    },
    data: () => ({}),
    watch: {
        'getUser._id'(newValue) {
            if (!newValue) return;

            this.loadUserNotifications(newValue);
        }
    },
    sockets: {
        'notifications:push'(notification: ILog) {
            this.$notifications.push(this.getNotification(notification));
        }
    },
    methods: {
        enterNotification(el: Element) {
            setTimeout(() => {
                this.$notifications.hide(Number(el.id));
            }, 7000);
        },
        getNotification(notification: ILog): INotification {
            const code = codes[notification.code];

            let message = '';

            let buttons: Array<INotificationButton> = [];

            const id = Math.random();

            switch(notification.code) {
                case 202:
                    message = `In ${notification?.props?.project}`;

                    buttons = ['accept', 'refuse'].map(x => ({
                        label: x[0].toLocaleUpperCase() + x.slice(1),
                        click: async () => {
                            const [result, status] = await Projects.action(notification?.props?.project, 'invate', x);

                            if (status !== 200) return;

                            this.$notifications.push({
                                title: 'Project action',
                                message: 'Everything went well',
                                color: 'var(--green)'
                            });

                            this.$notifications.remove(id);
                        }
                    }));
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
        },
        async loadUserNotifications(userId: string) {
            if (!userId) return;

            const [result, status] = await Users.notifications(userId);

            if (status !== 200) return;

            const notifications: Array<INotification> = result.results.map(n => this.getNotification(n));
            this.$notifications.addNotifications(notifications, true);
        }
    },
    mounted() {}
})

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
}

</style>