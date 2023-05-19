<template>
    <div class="notifications">
        <Transition name="bg">
            <div class="bg" v-if="getActiveNotifications" @click="setActiveNotifications(false)"></div>
        </Transition>
        <Transition name="panel">
            <div class="panel" v-if="getActiveNotifications">
                <ScrollBar>
                    <header>
                        <span>Notifications</span>
                        <Icon name="close" @click="setActiveNotifications(false)"/>
                    </header>
                    <ul class="list menu">
                        <Notification v-for="notification of getListNotifications" :key="notification" :id="notification.id"
                            :notification="notification"
                        />
                        <div style="padding: 12px; color: var(--text-secondary);" v-show="getListNotifications.length < 1">So far, it's empty</div>
                    </ul>
                </ScrollBar>
            </div>
        </Transition>

        <ul :class="['list global', getPositionNotifications, { active: !getActiveNotifications }]">
            <TransitionGroup name="notification" @enter="enterNotification($event)">
                <Notification v-for="notification of getListNotifications.filter((n: any) => !n?.hide).slice(0, getMaxCountNotification)" :key="notification" :id="notification.id"
                    :style="{ 'transform-origin': getPositionNotifications }"
                    :notification="notification"
                />
            </TransitionGroup>
        </ul>
    </div>
</template>

<script setup lang="ts">

import ScrollBar from './ScrollBar.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import Notification from './notifications/Notification.vue';

export default defineComponent({
    name: 'Notifications',
    components: {
        Notification
    },
    computed: {
        ...mapGetters(['getActiveNotifications', 'getListNotifications', 'getPositionNotifications', 'getWinHeight']),
        getMaxCountNotification(): number {
            let count: number = Math.floor(this.getWinHeight / 70) - 2;
            return count > 7 ? 7 : count;
        }
    },
    data: () => ({}),
    watch: {},
    methods: {
        ...mapActions(['setActiveNotifications', 'pushNotification', 'hideNotification', 'removeNotification']),
        enterNotification(el: Element) {
            setTimeout(() => {
                this.hideNotification(Number(el.id));
            }, 7000);
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