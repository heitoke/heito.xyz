<template>
    <div class="notifications" ref="root">
        <Transition name="bg">
            <div class="bg" v-if="$notifications.isActive"
                @click="$notifications.setActive(false)"
            ></div>
        </Transition>

        <div :class="['panel', ...$notifications.position, $notifications.isActive ? 'active blur' : '']">
            <header v-if="$notifications.isActive">
                <span>Notifications</span>

                <Icon name="close" @click="$notifications.setActive(false)"/>
            </header>

            <ul class="list">
                <div class="plus" v-if="!$notifications.isActive && getNotHides.length > 7">
                    +{{ getNotHides.length - 7 }}
                </div>

                <TransitionGroup name="notification" @enter="onEnterNotification">
                    <CardNotification v-for="notification of getListNotifications" :key="notification.id"
                        :id="String(notification.id)"

                        :notification="notification"
                        :show-buttons="$notifications.isActive"
                    
                        @click="$notifications.setActive(true)"
                    />
                </TransitionGroup>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

import CardNotification from './Card.vue';


const root = ref<HTMLElement | null>(null);


const
    $user = useUserStore(),
    $notifications = useNotificationsStore();


const getMaxCountNotifications = computed<number>(() => {
    const count = process.server ? 1 : Math.floor(window.innerHeight / 70) - 2;

    return count > 7 ? 7 : count;
});

const getListNotifications = computed(() => {
    const list = $notifications.list.filter(n => $notifications.isActive ? true : !n.isHidden);

    if ($notifications.isActive) return list;

    return list.slice(0, getMaxCountNotifications.value);
});

const getNotHides = computed(() => {
    return $notifications.list.filter(n => !n.isHidden);
});


watch(() => $user.user?._id || '', (newValue: string) => {
    if (!newValue) return;

    fetchUserNotifications();
});



function onEnterNotification(el: Element) {
    const id = Number(el.id);

    if ($notifications.isActive) return $notifications.hide(id);

    setTimeout(() => $notifications.hide(id), 7000);
}

async function fetchUserNotifications() {
    
}

</script>

<style lang="scss" scoped>

.notification-enter-active,
.notification-leave-active {
    margin: 0;
    padding: 0;
    max-height: 0px;
    height: 0px;
    transform: scale(0.8);
    opacity: 0;
}


.notifications {
    display: grid;
    pointer-events: none;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 106;

    .bg {
        pointer-events: all;
        width: 100dvw;
        height: 100dvh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #00000055;
        transition: .2s;
        z-index: 1;

        &-enter-active,
        &-leave-active {
            opacity: 0;
        }
    }

    .panel {
        display: flex;
        width: 376px;
        max-height: 100vh;
        min-height: 0;
        position: absolute;
        right: 0;
        bottom: 0;
        flex-direction: column;
        transition: all .5s;
        z-index: 2;
        
        &:not(.active) {
            &.top {
                align-self: flex-start;

                &.center { align-self: center; }
            }

            &.right {
                justify-self: flex-end;

                &.center { justify-self: center; }
            }

            &.bottom {
                align-self: flex-end;

                &.center { align-self: center; }
            }

            &.left {
                justify-self: flex-start;

                &.center { justify-self: center; }
            }

            ul.list {
                display: grid;
                margin: 2%;

                .notification {
                    border-color: var(--background-secondary-alt);

                    &:not(:last-child) {
                        margin-bottom: 8px;
                    }
                }

                .plus {
                    margin: 0 0 8px auto;
                    padding: 4px 8px;
                    color: var(--text-secondary);
                    font-size: 10px;
                    border-radius: 5px;
                    border: 1px solid var(--background-secondary-alt);
                    background-color: var(--background-secondary);
                }
            }
        }

        &.active {
            pointer-events: all;
            min-height: 100vh;
            border-left: 1px solid var(--background-secondary);
            // background-color: ;

            ul.list {
                margin: 12px 12px 0 12px;
                overflow-x: hidden;
            }
        }

        header {
            display: flex;
            margin: 0 12px;
            padding: 12px;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--background-secondary);
            box-sizing: border-box;

            span {
                font-size: 18px;
                font-weight: 500;
            }

            i {
                cursor: pointer;
                color: var(--red);
                font-size: 18px;
            }
        }

        ul.list {
            flex: 1;
            transition: all .2s;

            .notification {
                cursor: pointer;
                pointer-events: all;
                max-width: 100%;
                border: 1px solid transparent;
                transform-origin: v-bind('$notifications.position');
                transition: all .3s;

                &:not(:last-child) {
                    margin-bottom: 8px;
                }
            }
        }
    }
}

</style>