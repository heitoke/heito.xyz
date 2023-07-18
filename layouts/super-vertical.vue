<template>
    <div :class="['super vertical', { active }]">
        <slot/>

        <Transition name="menu">
            <div class="menu" v-if="active">
                <div class="subtitle">Pages</div>

                <ul class="pages">
                    <li v-for="route of getRoutes" :key="route.name"
                        :class="{ active: $route.name === route.name, hide: getHideRoutes.find(r => r.name === route.name) }"
                        @click="$router.push(route.meta?.mainPage || route.path)"
                    >
                        <span>{{ route?.meta?.title }}</span>

                        <Icon :name="route.meta?.icon as string"/>
                    </li>
                </ul>

                <div class="line"></div>

                <div style="margin: auto 0 0 0;"></div>

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

    return routes
        .sort((a, b) => (a.meta?.index || 0) > (b.meta?.index || 0) ? 1 : 0)
        .filter(route => (isAdmin ? true : !getHideRoutes.value.find(p => p.name === route.name)));
});

</script>

<style lang="scss" scoped>

@keyframes MenuWidth {
    from {
        margin: 0;
        max-width: 0px;
        min-width: 0px;
        opacity: 0;
    }
    to {
        max-width: 256px;
        min-width: 256px;
    }
}

.menu-enter-active {
    animation: MenuWidth .2s linear;
}
.menu-leave-active {
    animation: MenuWidth .2s linear reverse;
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
        transition: all .2s;
        overflow: hidden;
    }

    .menu {
        display: flex;
        margin: 0 0 0 16px;
        min-width: 256px;
        flex-direction: column;
        transition: all .2s;

        ul.pages {
            li {
                cursor: pointer;
                display: flex;
                margin: 0 0 8px 0;
                padding: 8px 16px;
                color: var(--text-secondary);
                border-radius: 5px;
                // border: 1px solid var(--background-secondary);
                align-items: center;
                justify-content: flex-end;
                transition: .2s;

                &:last-child {
                    margin: 0;
                }

                &:hover {
                    color: var(--text-primary);
                }

                &.active {
                    color: var(--main-color);
                }

                &.hide {
                    opacity: .5;
                }

                .hx-icon {
                    margin: 0 0 0 8px;
                }
            }
        }

        .subtitle {
            margin: 8px 16px;
            color: var(--text-secondary);
            font-size: 12px;
            font-weight: 600;
            text-align: right;
            white-space: nowrap;
            text-transform: uppercase;
            opacity: .7;
        }

        .line {
            margin: 8px 16px;
            border-bottom: 1px solid var(--background-secondary);
            box-sizing: border-box;
        }

        ul.buttons {
            display: flex;
            padding: 0 16px;
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
        padding: 72px 8px 8px 8px;
        
        :deep(.scrollbar) {
            max-height: calc(100% - 16px);
            border-radius: 15px;
            box-shadow: 0 0 0 3px var(--background-secondary);
        }
    }
}

</style>