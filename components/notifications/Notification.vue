<template>
    <div
        :class="['notification', {
            shadow: notification.shadow,
            's-right': notification.shadowPosition === 'right',
        }]"
        :style="{ '--notification-color': notification.color }"
    >
        <header>
            <div class="icon" v-show="notification.icon">
                <Icon :name="notification.icon"/>
            </div>
            <div>
                <div class="title">{{ notification.title || 'Title' }}</div>
                <div class="text" v-html="notification.message"></div>
            </div>
        </header>

        <NavBar style="margin: 8px 0 0 0;" v-if="notification?.buttons?.length! > 0 && showButtons"
            :menu="notification.buttons"    
        />
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import NavBar from '~/components/content/NavBar.vue';

import type { INotification } from 'types/stores/notifications';

const props = defineProps({
    notification: {
        type: Object as PropType<INotification>,
        default: () => ({})
    },
    showButtons: { type: Boolean, default: false }
});

</script>

<style lang="scss" scoped>

@keyframes ShowNotification {
    from {
        max-width: 48px;
        width: 100%;
        opacity: 0;
    }
    to {
        max-width: 376px;
    }
}

.notification.old {
    pointer-events: all;
    transition: all .2s;
    animation: ShowNotification 1s linear;
    overflow: hidden;

    header {
        display: flex;
        min-height: 64px;
        border-radius: 5px;
        align-items: center;
    }

    .icon {
        display: flex;
        max-width: 48px;
        min-width: 48px;
        height: 100%;
        position: relative;
        align-items: center;
        justify-content: center;
        // background-color: var(--background-secondary);
        transition: .2s;
        user-select: none;
        overflow: hidden;

        &::before, &::after {
            content: " ";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: var(--background-secondary);
            transition: .2s;
            z-index: -1;
        }

        &::after {
            top: 90%;
            box-shadow: 0 0 10px -2px aqua;
            background-color: aqua;
        }

        div {
            font-size: 18px;
        }
    }

    .icon + div {
        padding: 8px;
        max-width: 376px;
        min-width: 256px;
        background-color: var(--background-primary);
        
        .title {
            // font-family: 'Shalimar' !important;
            font-weight: 600;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-lines: 2;
            overflow: hidden;
        }

        .text {
            color: var(--text-secondary);
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
}

.notification {
    pointer-events: all;
    padding: 12px;
    max-width: 512px;
    min-width: 215px;
    // min-height: 64px;
    position: relative;
    border-radius: 5px;
    transition: all .2s;
    font-family: 'Shalimar' !important;
    // animation: ShowNotification 1s linear;
    // background-color: var(--background-secondary);
    backdrop-filter: blur(5px);
    overflow: hidden;

    header {
        display: flex;
        position: relative;
        align-items: center;
    }

    &.shadow::before {
        box-shadow: 0 0 150px 200px var(--notification-color);
    }

    &.shadow-right:is(.shadow) {
        &::before {
            left: auto;
            right: -64px;
            box-shadow: 0 0 150px 200px var(--notification-color);
        }
    }

    &::before {
        content: " ";
        width: 64px;
        height: 64px;
        position: absolute;
        top: 50%;
        left: -64px;
        border-radius: 50%;
        background-color: var(--notification-color);
        transform: translateY(-50%);
        filter: brightness(60%);
        opacity: .7;
    }

    .icon {
        display: flex;
        margin: 0 12px 0 0;
        min-width: 32px;
        min-height: 32px;
        position: relative;
        border-radius: 5px;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        z-index: 3;

        &::before {
            content: " ";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            // box-shadow: 0 0 50px 5px #000000;
            background-color: var(--notification-color);
            opacity: .3;
        }

        .hx-icon {
            --color: var(--notification-color);
            z-index: 2;
        }
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