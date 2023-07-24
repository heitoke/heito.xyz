<template>
    <div :class="['super horizontal', { active }]">
        <slot/>

        <Transition name="menu">
            <div class="menu blur" v-if="active">
                <!-- <div class="line"></div> -->

                <!-- <div style="margin: auto 0 0 0;"></div> -->

                <Select label="Go to page" :readonly="true" style="width: 128px;"
                    :value="$route.path"
                    :position="'top'"
                    :menu="getRoutes"
                    :sort="false"
                    @select="$router.push($event.value)"
                />

                <div class="line"></div>

                <ul class="buttons">
                    <li @click="windows.create({ component: 'Setting' })"
                        @mouseenter="toolpics.set({ text: 'Settings' })"
                    >
                        <Icon name="settings"/>
                    </li>

                    <li @click="notifications.setActive(true)"
                        @mouseenter="toolpics.set({ text: 'Notifications' })"
                    >
                        <Icon name="notification"/>
                    </li>

                    <li v-if="isAdmin"
                        @mouseenter="toolpics.set({ text: 'Admin panel' })"
                        @click=""
                    >
                        <Icon name="fire"/>
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

import { EPermissions } from '~/types/api/user';

import type { ItemButton } from '~/types/stores/contextMenu';

const { $router } = useNuxtApp();

const
    user = useUserStore(),
    windows = useWindowsStore(),
    notifications = useNotificationsStore(),
    toolpics = useToolpicsStore(),
    config = useConfigStore();

const props = defineProps({
    active: { type: Boolean, default: false }
});


const isAdmin = computed(() => {
    return user.getPer(EPermissions.Site);
});

const getHideRoutes = computed<any[]>(() => {
    if (config.getStatus !== 'online') return [];
    
    return config.getConfig.pages.filter(p => !p.enabled);
});

const getRoutes = computed(() => {
    const routes = $router.options.routes.filter(route => Boolean(route.meta?.title));

    let list: Array<Omit<ItemButton, 'type'>> = [];

    for (let route of routes.sort((a, b) => (a.meta?.index || 0) > (b.meta?.index || 0) ? 1 : 0)) {
        if (getHideRoutes.value.find(p => p.name === route.name)) continue;

        const { title, icon, mainPage } = route?.meta!;

        list = [...list || [], {
            label: title as string || '',
            icon: icon as string || 'pacman',
            value: mainPage || route?.path || ''
        }];
    }

    return list;
});

</script>

<style lang="scss" scoped>

.menu-enter-active,
.menu-leave-active {
    transform: translate(-50%, 32px) !important;
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: .2s;
    opacity: 0;
}

.super {
    display: flex;
    position: relative;
    max-width: 100vw;
    min-width: 100vw;
    max-height: 100vh;
    min-height: 100vh;
    box-sizing: border-box;
    transition: all .2s;

    .scrollbar {
        width: 100%;
        max-height: 100%;
        transition: all .2s;
        overflow: hidden;
    }

    .menu {
        display: flex;
        padding: 0 16px;
        max-width: 90vw;
        height: 64px;
        position: absolute;
        left: 50%;
        bottom: 12px;
        border-radius: 7px;
        border: 1px solid var(--background-secondary);
        align-items: center;
        justify-content: center;
        transform: translateX(-50%);
        transition: all .2s;


        .line {
            margin: 0 12px;
            height: 60%;
            border-left: 1px solid var(--background-secondary);
            box-sizing: border-box;
        }

        ul.buttons {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            li {
                cursor: pointer;
                display: flex;
                margin: 0 8px 0 0;
                min-width: 32px;
                height: 32px;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                border: 1px solid var(--T);
                background-color: var(--background-secondary);
                transition: .2s;

                &:hover {
                    border-color: var(--main-color);
                }

                &:last-child {
                    margin: 0;
                }
            }
        }
    }
    
    &.active {
        padding: 72px 5% 96px 5%;
        
        :deep(.scrollbar) {
            max-height: calc(100% - 16px);
            border-radius: 15px;
            // box-shadow: 0 0 0 3px var(--background-secondary);
        }
    }
}

</style>