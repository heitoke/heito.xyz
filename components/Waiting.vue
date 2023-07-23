<template>
    <Transition name="waiting">
        <div :class="['waiting', { error }]" v-if="show">
            <div class="content">
                <h1>{{ title }}</h1>
                
                <Text class="text" :text="stages[stage]"/>

                <div style="display: flex; margin: 12px 0 0 0; align-items: center;">
                    <Skeleton style="margin: 0 12px 0 0; border-radius: 50%;" :show="Boolean(user.getUser?._id)">
                        <template #default>
                            <div class="user-avatar" :style="{ 'background-image': `url('${getUserAvatar}')` }"
                                @mouseenter="toolpics.set({ text: user.getUser?.nickname || user.getUser?.username || user?.getUser?._id || 'Guast' })"
                            ></div>
                        </template>
                        <template #before>
                            <Loading style="padding: 4px 4px 0 4px;"
                                :size="'20px'"
                                :type="'circle'"
                                color="var(--red)"
                                alphacolor="var(--red-alpha)"
                            />
                        </template>
                    </Skeleton>

                    <div class="bar">
                        <div :style="{ width: `${100 * (stage + 1) / stages.length}%` }"></div>
                    </div>
                </div>

                <Height :showed="$socket?.connected || false">
                    <Text class="sockets" text="Sockets are connected" style="margin: 8px 0 0 0;"/>
                </Height>

                <Height :showed="error" @click="close()">
                    <Button color="var(--red-alpha)" style="margin: 12px 0 0 0;">
                        <span>Log in offline mode</span>
                    </Button>
                </Height>
            </div>

            <Text class="footer" :text="error ? ':O' : 'Preparations are underway, thanks for waiting'"/>
        </div>
    </Transition>
</template>

<script lang="ts" setup>

import { type IUser, EPermissions } from '~/types/api/user';
import type { IConfigDefault } from '~/types/api/config';

import type { IMessage } from '~/windows/Message.vue';
import { config } from 'process';


const { $api, $socket } = useNuxtApp();

const
    $user = useUserStore(),
    $notifications = useNotificationsStore(),
    $windows = useWindowsStore(),
    $config = useConfigStore();


const
    user = useUserStore(),
    toolpics = useToolpicsStore();

/* Stages

0 - Init
1 - Connecting user
2 - Connected user
3 - Loading config
4 - Scan config
5 - Install config
6 - Finish

*/

const emit = defineEmits(['end']);


const
    show = ref<boolean>(true),
    title = ref<string>(''),
    stage = ref<number>(0),
    error = ref<boolean>(false);

const stages = [
    'Initialization of this nightspot',
    'The user is trying to sit down',
    'The user asks for something in his mouth',
    'Initialization of products',
    'Checking products in stock',
    'Gently placed in the user\'s mouth',
    'The end of the meal'
];

const titles = [
    'You\'re almost there',
    'It\'s not far away',
    'A little more',
    'Wait don\'t rush',
    'Can you sit down here?'
];


const getUserAvatar = computed(() => {
    return user.getUser?.avatar || getAvatar({ nameId: user.getUser?._id });
});



$socket?.on('configs:update', (_config) => {
    $config.set(_config);

    $notifications.push({
        title: 'Update',
        icon: 'settings',
        message: 'A configuration update has occurred',
        color: 'var(--blue)'
    });

    loadConfig(_config);
});



function close() {
    show.value = false;

    emit('end');

    $config.setStatus(error.value ? 'offline' : 'online');
}

function loadConfig(config: IConfigDefault) {
    stage.value = 5; // Install config

    // const
    //     hidePages = config.pages?.filter(p => !p.enabled),
    //     page = hidePages.find(p => p.name === route.name || $router.currentRoute.value.matched.find(r => r.name === p.name)),
    //     isAdmin = $user.getUser?.permissions?.includes(EPermissions.Site),
    //     user = page?.users.find(u => u.user._id === $user.getUser?._id);

    // if (!isAdmin && !user?.allowed) {
    //     blocked.value = Boolean(page);
    // } else blocked.value = false;

    stage.value = 6; // Finish

    setTimeout(() => close(), 1000);
}

async function initConfig() {
    stage.value = 3; // Loading config

    const [config, status] = await $api.configs.default();
    
    if (status !== 200) {
        $notifications.error({
            message: 'Failed to load configuration',
            status
        });

        return error.value = true;
    }

    $config.set(config);

    stage.value = 4; // Scan config

    loadConfig(config);
}

async function initUser() {
    stage.value = 1; // Connecting user
    
    const [user, status, props] = await $api.users.me();

    if (status !== 200) {
        $notifications.error({
            message: 'Failed to load the user.'
        });

        return error.value = true;
    }

    function setTokens(props: any) {
        if (props?.token?.refresh) cookies.set('HX_RT', props?.token?.refresh, { days: 365 });
        if (props?.token?.access) cookies.set('HX_AT', props?.token?.access, { days: 7 });
        if (props?.token?.guast) cookies.set('HX_GUAST', props?.token?.guast, { days: 365 });
    }

    stage.value = 2; // Connected user
    
    if (props?.confirmation?.userId) {
        let password = '';

        $windows.create({
            component: 'Message',
            close: {
                enable: false
            },
            data: {
                title: 'Account confirmation',
                text: 'Enter the password of the account that was previously authorized. If you don\'t want to log in or don\'t know the password, you can just skip it.',
                components: [
                    {
                        name: 'password',
                        component: 'Textbox',
                        props: {
                            label: 'Password',
                            type: 'password'
                        },
                        events: {
                            input: (e: MouseEvent) => {
                                password = (e.target as any)?.value as string;
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        label: 'Confirm',
                        color: 'var(--green)',
                        click: async (e: MouseEvent, data: any, windowId: number) => {
                            const [user, status] = await $api.auth.login({ login: props?.confirmation?.userId, password });

                            if (status !== 200) return $notifications.error({
                                status,
                                message: user?.message
                            });
                            
                            $windows.close(windowId);
                        }
                    },
                    {
                        label: 'Leave it as it is',
                        color: 'var(--red)',
                        click: async (e: MouseEvent, data: any, windowId: number) => {
                            const [user, status, props] = await $api.users.me('none');

                            if (status !== 200) return $notifications.push({ message: 'Failed to load the user.' });

                            setTokens(props);

                            cookies.delete(['HX_RT', 'HX_AT']);

                            $user.set(user);

                            $windows.close(windowId);
                        }
                    }
                ]
            } as IMessage
        });
        return;
    }

    setTokens(props);

    if (props?.merge) {
        $windows.create({
            component: 'UserMerge',
            close: {
                enable: false
            },
            data: props.merge
        });
    }

    if (user?._id) $user.set(user);

    initConfig();
}



onMounted(() => {
    title.value = titles[Math.floor(Math.random() * titles.length)];

    initUser();
});


</script>

<style lang="scss">

.waiting {
    display: flex;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    background-color: var(--background-primary);
    transition: .4s;
    z-index: 109;

    &-enter-active,
    &-leave-active {
        opacity: 0;
    }

    &.error {
        .content {
            .text {
                color: var(--red);
            }

            .bar {
                background-color: var(--red-alpha);

                div {
                    background-color: var(--red);
                }
            }
        }
    }

    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        h1 {
            margin: 0 0 24px 0;
            font-size: calc(var(--font) - 1.5vmin);
        }

        .text {
            height: 16px;
            color: var(--text-secondary);
        }

        .bar {
            width: 196px;
            height: 4px;
            position: relative;
            border-radius: 5px;
            background-color: var(--background-secondary);
            overflow: hidden;

            div {
                height: 100%;
                background: var(--main-color);
                transition: all .2s;
            }
        }

        .user-avatar {
            margin: 0 12px 0 0;
            padding: 12px !important;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            background-color: var(--background-secondary);
        }

        .sockets {
            color: var(--main-color);
            font-size: 12px;
            font-weight: 700;
        }
    }

    .footer {
        position: absolute;
        font-size: 12px;
        bottom: 16px;
        opacity: .5;
        user-select: none;
    }
}

</style>