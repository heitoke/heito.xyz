<template>
    <div :class="['account', { active: isOpen }]" ref="root">
        <div :class="['data', { blur: isOpen }]">
            <div class="header"
                @click="isOpen ? openProfile() : false"
                :style="{
                    padding: isOpen ? `${false ? 20 : 16}px 8px` : undefined,
                    '--color': $user.user?.color || 'var(--main-color)',
                    '--image': `url('${$user.getBanner || null}')`,
                }"
            >
                <Transition name="account-username">
                    <div class="username" v-show="isOpen"
                        :style="{
                            color: '#fff'
                        }"
                    >{{ getDisplayName }}</div>
                </Transition>

                <div :class="['avatar']"
                    @click.prevent.stop="isOpen ? openProfile() : open($event, root, () => isOpen = true, () => isOpen = false)"
                >
                    <div :style="{ 'background-image': `url('${$user.getAvatar}')` }" v-if="$user.user?._id"></div>
                </div>
            </div>

            <Menu v-if="isOpen"
                style="margin-top: 12px;"

                :items="getUserMenuItems"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

import Menu from '~/components/models/content/Menu.vue';

import type { Item } from '~/types/stores/contextMenu';


const { $local, $langs, $api, $socket, $router } = useNuxtApp();

const $user = useUserStore()


const root = ref<HTMLElement | null>(null);


const
    isOpen = ref<boolean>(false),
    darkMode = ref(true),
    lang = ref('English');


const getDisplayName = computed(() => {
    return $user.user?.displayName || $user.user?.username;
});


const getUserMenuItems = computed<Array<Item>>(() => {
    return [
        {
            type: 'button',
            label: 'Settings',
            icon: 'settings'
        },
        {
            type: 'checkbox',
            label: 'Dark mode',
            icon: 'sun-moon',
            value: darkMode,
            click: value => darkMode.value = value
        },
        {
            type: 'children',
            label: 'Language',
            icon: 'translate',
            text: `${lang.value} (Beta)`,
            items: ['English', 'Russian'].map(l => ({
                type: 'radio',
                label: l,
                icon: 'translate',
                name: 'language',
                value: l,
                ref: lang,
                click: () => lang.value = l
            }))
        },
        { type: 'separator' },
        {
            type: 'button',
            label: 'Sessions',
            icon: 'users'
        },
        // { type: 'separator' },
    ];
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

function openProfile() {}

</script>

<style lang="scss" scoped>

.account {
    margin: 0 16px;
    min-width: 42px;
    position: relative;
    transition: .2s;

    &.active {
        min-width: 196px;
    }

    .data {
        width: 100%;
        position: absolute;
        top: -22px;
        border: 1px solid var(--T);
        transition: .2s;
    }

    &:not(.active) .data {
        .header {
            &:hover {
                transform: rotate(0) scale(1.3);

                .avatar {
                    border-radius: 50%;
                }

            }

            .avatar {
                transform: rotate(25deg);

                div {
                    transform: rotate(-25deg);
                }
            }
        }
    }

    &.active .data {
        padding: 8px;
        border-radius: 5px;
        border-color: var(--background-secondary);
        top: -24px;
        right: -8px;

        &::before {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 5px;
            background: var(--background-secondary);
            opacity: .5;
            z-index: -1;
        }

        .header {
            cursor: pointer;
            border-radius: 5px;
            overflow: hidden;

            &::after {
                content: " ";
                opacity: 1;
            }

            .avatar {
                min-width: 42px;
                min-height: 42px;
                border-radius: 50%;
            }
        }
    }

    .header {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: flex-end;
        transition: all .2s;
        z-index: 2;

        &::after {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-size: cover;
            background-position: center;
            background-color: var(--color);
            background-image: var(--image);
            transform: scale(1.2);
            transition: .2s;
            filter: blur(2px) grayscale(1);
            z-index: -1;
        }

        .username {
            max-width: 100%;
            margin-right: 12px;
            font-size: 14px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .avatar {
            cursor: pointer;
            display: flex;
            min-width: 42px;
            min-height: 42px;
            position: relative;
            border-radius: 10px;
            align-items: center;
            justify-content: center;
            transition: .2s;
            overflow: hidden;
    
            div {
                width: 120%;
                height: 120%;
                position: absolute;
                background-size: cover;
                background-color: var(--background-secondary);
                background-position: 50% 50%;
                transition: .2s;
            }
        }
    }


    @media (max-width: 740px) {
        &.active {
            min-width: auto;

            .data {
                min-width: 196px;
                right: -64px;
            }
        }

        .data {
            z-index: 1;
        }
    }
}

</style>