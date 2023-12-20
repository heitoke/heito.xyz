<template>
    <div :class="['notification']">
        <header>
            <div v-if="notification?.image || notification.icon"
                :class="{
                    image: notification?.image,
                    icon: notification?.icon
                }"
            >
                <img :src="notification.image" v-if="notification.image"/>

                <Icon :name="notification.icon" v-if="notification.icon"/>
            </div>

            <div>
                <div>{{ notification.title }}</div>

                <div>{{ notification.text }}</div>
            </div>
        </header>
    </div>
</template>

<script lang="ts" setup>

import type { Notification } from '~/types/stores/notifications';


const props = defineProps<{
    notification: Notification;
    showButtons?: boolean;
}>();

</script>

<style lang="scss" scoped>

.notification {
    pointer-events: all;
    padding: 12px;
    max-width: 512px;
    min-width: 215px;
    position: relative;
    border-radius: 5px;
    transition: all .2s;
    backdrop-filter: blur(5px);
    overflow: hidden;

    header {
        display: flex;
        position: relative;
        align-items: center;

        & > div:nth-child(1) {
            margin-right: 12px;
            position: relative;

            &.icon {
                max-width: 32px;
                min-width: 32px;
                height: 32px;
            }

            &.image {
                max-width: 48px;
                min-width: 48px;
                height: 48px;
            }

            &.image.icon {
                img {
                    mask-image: radial-gradient(circle 12px at center, transparent 100%, green 0%);
                    mask-size: 84px 84px, 100%;
                }
                
                .ui-icon {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    bottom: -4px;
                    right: -4px;
                    border-radius: 50%;
                    z-index: 2;

                    &::after {
                        background-color: transparent;
                    }
                }
            }

            img {
                width: 100%;
                height: 100%;
                border-radius: 5px;
                object-fit: cover;
                object-position: center;
            }

            .ui-icon {
                display: flex;
                width: 100%;
                height: 100%;
                position: relative;
                color: v-bind('notification.color');
                border-radius: 5px;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                z-index: 3;
    
                &::after {
                    content: "";
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    background-color: v-bind('notification.color');
                    opacity: .2;
                }
            }
        }



        & > div {
            max-width: 100%;
            min-width: 0;
            flex: 1;

            div {
                max-width: 100%;
                text-overflow: ellipsis;
                overflow: hidden;

                &:nth-child(1) {
                    font-weight: 600;
                    white-space: nowrap;
                }

                &:nth-child(2) {
                    display: -webkit-box;
                    color: var(--text-secondary);
                    font-size: 14px;
                    line-clamp: 2;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }
        }
    }

    &::before {
        box-shadow: 0 0 150px 200px v-bind('notification.color');
    }

    &::before {
        content: " ";
        width: 64px;
        height: 64px;
        position: absolute;
        top: 50%;
        left: -64px;
        border-radius: 50%;
        background-color: v-bind('notification.color');
        transform: translateY(-50%);
        filter: brightness(60%);
        opacity: .7;
    }

    .title, .text {
        position: relative;
        z-index: 4;
    }

    .title {
        font-weight: 700;
    }

    .text {
        font-weight: 600;
        color: var(--text-secondary);
    }
}


</style>