<template>
    <div :class="['activities', { active: isActive }]" ref="root">
        <Transition name="activities">
            <div :class="['data', { blur: isActive }]"
                @click="open($event, root, () => isActive = true, () => isActive = false)"
            >
                <Activity :show-buttons="isActive"
                    :content="{
                        type: isActive ? 'default' : 'mini',
                        name: 'das',
                        largePreview: {
                            type: 'image',
                            url: $user.getAvatar
                        },
                        progress: {
                            position: 'content',
                            type: 'time',
                            value: 1000,
                            end: 3600
                        },
                        buttons: [
                            {
                                label: 'das',
                                icon: 'user-circle',
                                color: 'var(--blue)',
                                value: '1'
                            },
                            {
                                label: 'das',
                                icon: 'user-circle',
                                color: 'var(--blue)',
                                value: '2'
                            },
                            {
                                label: 'das',
                                icon: 'user-circle',
                                color: 'var(--blue)',
                                value: '3'
                            },
                            {
                                label: 'das',
                                icon: 'user-circle',
                                color: 'var(--blue)',
                                value: '4'
                            },
                            {
                                label: 'das',
                                icon: 'user-circle',
                                color: 'var(--blue)',
                                value: '5'
                            }
                        ]
                    }"
                />

                <Height :show="isActive">
                    <Transition name="fadeHeight">
                        <div class="list">
                            <div>
                                <Activity v-for="(activity, idx) of [...list, ...list, ...list]" :key="idx"
                                    :content="activity"
                                    :show-buttons="true"
                                />
                            </div>
                        </div>
                    </Transition>
                </Height>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

import Activity, { type Activity as ActivityContent } from './Activity.vue';


const { $api } = useNuxtApp();

const $user = useUserStore();


const root = ref<HTMLElement | null>(null);


const
    isActive = ref(false),
    list = ref<Array<ActivityContent>>([
        {
            type: 'default',
            name: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            details: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            state: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            largePreview: {
                type: 'icon',
                icon: 'notification',
                color: 'var(--green)'
            },
            smallPreview: {
                type: 'icon',
                icon: 'search-alt',
                color: 'var(--red)'
            },
            progress: {
                type: 'time',
                value: 1000,
                end: 3600
            },
            buttons: [
                {
                    value: 'Test'
                }
            ]
        },
        {
            type: 'mini',
            name: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            details: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            state: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            largePreview: {
                type: 'image',
                url: $user.getAvatar
            },
            smallPreview: {
                type: 'icon',
                icon: 'notification',
                color: 'var(--green)'
            },
            progress: {
                type: 'numbers',
                value: 1000,
                end: 3600
            }
        },
        {
            type: 'mini',
            name: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            details: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            state: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            largePreview: {
                type: 'icon',
                icon: 'pacman'
            },
            smallPreview: {
                type: 'icon',
                icon: 'notification',
                color: 'var(--green)'
            },
            progress: {
                type: 'numbers',
                value: 1000,
                end: 3600
            }
        },
        {
            type: 'default',
            name: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            details: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            state: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
            largePreview: {
                type: 'image',
                url: $user.getAvatar
            },
            progress: {
                type: 'numbers',
                value: 1000,
                end: 3600
            }
        }
    ]);


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

</script>

<style lang="scss" scoped>

.activities {
    margin-left: 32px;
    height: 42px;
    position: relative;

    &-enter-active,
    &-leave-active {
        transform: translateY(-32px);
        opacity: 0;
    }

    &.active {
        .data {
            cursor: auto;
            padding: 12px;
            top: calc(50% - 24px);
            left: -12px;
            border-color: var(--background-secondary);

            &::before {
                opacity: .5;
            }
        }
    }

    .data {
        cursor: pointer;
        max-width: 256px;
        min-width: 256px;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px;
        border: 1px solid var(--T);
        transition: .3s;

        &::before {
            content: " ";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 5px;
            background: var(--background-secondary);
            opacity: 0;
            z-index: -1;
        }
    
        .list {
            margin: 12px 0 0 0;
            padding: 12px 0 0 0;
            max-height: 60dvh;
            border-top: 1px solid var(--background-secondary);
            overflow-x: hidden;

            .activity {
                margin: 0 0 12px 0;

                &:last-child {
                    margin: 0;
                }
            }
        }
    }
}

</style>