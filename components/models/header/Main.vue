<template>
    <header :style="{ padding: $route.meta?.pageOptions?.padding || '0 32px' }">
        <div class="logo">
            <img src="/favicon.ico" alt="Logo">

            <div>
                <NuxtLink to="/"
                    @contextmenu.stop.prevent="showAdminContextMenu"
                >heito.xyz</NuxtLink>

                <div class="online">
                    <span>{{ $t('online') }}:</span> 1
                </div>
            </div>
        </div>

        <Activities/>

        <div style="margin-left: auto;"></div>

        <Menu/>

        <User/>

        <div :class="['super', { active: $super.isActive }]"
            @click="$super.set(!$super.isActive)"
        >
            <div></div>
            <div></div>
            <div></div>
        </div>
    </header>
</template>

<script lang="ts" setup>

import Activities from './Activities.vue';
import User from './User.vue';
import Menu from './Menu.vue';


const
    $super = useSuperStore(),
    $windows = useWindowsStore(),
    $contextMenu = useContextMenuStore();


function showAdminContextMenu(event: Event) {
    $contextMenu.create({
        name: 'site:admin',
        event,
        items: [
            {
                type: 'button',
                label: 'Configs',
                icon: 'chat-message',
                click: () => {
                    $windows.create('AdminConfigsList');
                }
            }
        ]
    });
}

</script>

<style lang="scss" scoped>

header {
    display: flex;
    width: 100vw;
    height: 64px;
    position: relative;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    transition: .3s;
    z-index: 100;

    .logo {
        display: flex;
        align-items: center;

        img {
            margin-right: 8px;
        }

        a {
            color: var(--text-primary);
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }

        .online {
            color: var(--main-color);
            font-size: 12px;

            span {
                color: var(--text-secondary);
            }
        }
    }

    .super {
        cursor: pointer;
        display: flex;
        position: relative;
        width: 20px;
        height: 16px;
        flex-direction: column;
        justify-content: space-between;

        &:hover {
            div {
                background-color: var(--text-primary);
            }
        }

        &.active {
            div {
                background-color: var(--main-color);
            }
        }

        div {
            width: 100%;
            height: 1px;
            border-radius: 5px;
            background-color: var(--text-secondary);
            transition: .2s;
        }
    }
}

@media (max-width: 640px) {
    header {
        padding-left: 16px !important;
        padding-right: 16px !important;

        .activities {
            display: none;
        }
    }
}

</style>