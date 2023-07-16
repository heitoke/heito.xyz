<template>
    <div :class="['activities', { active }]" ref="root" v-if="$win.size?.width < 740 ? miniActive : true">
        <Transition name="activities">
            <div :class="['data', { blur: active || $win.size?.width < 740 }]" v-if="track?.id || list?.length > 0"
                @click="open($event, root, () => active = true, () => active = false)"
            >
                <Activity :show-buttons="active" :content="{
                    ...(track?.id ? track : list[0]),
                    type: active ? 'default' : 'mini'
                }"/>

                <Height :showed="active && list?.length > (track?.id ? 0 : 1)">
                    <ScrollBar max-height="60vh">
                        <Transition name="fadeHeight">
                            <div class="list">
                                <div>
                                    <Activity v-for="(activity, idx) in list.slice(track?.id ? 0 : 1)" :key="idx" :show-buttons="true"
                                        :content="activity"
                                    />
                                </div>
                            </div>
                        </Transition>
                    </ScrollBar>
                </Height>
            </div>
        </Transition>
    </div>

    <Icon name="music-note" v-if="$win.size?.width < 740 && (track?.id || list?.length > 0)"
        :style="`margin: 0 0 0 12px; ${miniActive ? 'color: var(--main-color);' : ''}`"
        @click="miniActive = !miniActive"
    />
</template>

<script lang="ts" setup>

import ScrollBar from '~/components/content/ScrollBar.vue';

import Activity, { type IContent } from './Activity.vue';

import type { ISteamAccount, IGitHubAccount, ITetrAccount, ITwitchAccount, IOSUAccount } from '~/types/sockets/accounts';

type TTrack = {
    id?: string;
    name?: string;
    preview?: string;
    type?: string;
    image?: string;
    artists?: Array<{ id: string, name: string, type: string, url: string }>;
    url?: string;
    start?: number;
    end?: number;
}


const { $socket } = useNuxtApp();

const root = ref<HTMLElement | null>(null);

const
    active = ref<boolean>(false),
    miniActive = ref<boolean>(false),
    track = ref<IContent>({} as any),
    list = ref<Array<IContent>>([]);

let timer: NodeJS.Timer;

function open(e: Event, ref: HTMLElement | null, callbackTrue: Function = () => {}, callbackFalse: Function = () => {}) {
    callbackTrue();

    let close = () => {
        window.addEventListener('click', (e) => {
            if (ref?.contains(e.target as any)) return close();
            
            callbackFalse();
        }, { once: true });
    }

    setTimeout(() => close(), 10);
}


$socket?.on('activities:track:playing', (data: { device: any, userId: string, track: TTrack, is_playing: boolean }) => {
    if (!data.is_playing) return;

    track.value = {
        id: 'spotify:track',
        type: 'mini',
        name: data?.track?.name as string,
        largeImage: {
            url: data?.track?.image as string
        },
        smallImage: data.device ? {
            label: data.device?.type,
            icon: data.device?.type === 'Computer' ? 'desktop' : (data.device?.type === 'Smartphone' ? 'mobile' : 'damage-void'),
            color: 'var(--main-color)'
        } : {},
        progressBar: {
            value: data?.track?.start,
            end: data?.track?.end,
            isTime: true
        },
        buttons: [
            { label: 'Profile', icon: 'user-circle', url: `https://open.spotify.com/user/${data?.userId}` },
            { label: 'Open track', icon: 'music-note', url: data?.track?.url }
        ]
    }
    

    clearTimeout(timer);

    timer = setTimeout(() => {
        track.value = {} as IContent;
    }, 6000);
});

$socket?.on('activities:list', (activitiesList: Array<{ type: 'steam' | 'github' | 'tetr' | 'twitch' | 'osu', [key: string]: any }>) => {
    list.value = [];

    for (let active of activitiesList) {
        let activity: IContent = { name: 'Activity', type: 'default' };

        switch(active?.type) {
            case 'steam':
                activity = getSteamActivity(active as any);
                break;
            case 'github':
                activity = getGitHubActivity(active as any);
                break;
            case 'tetr':
                activity = getTetrActivity(active as any);
                break;
            case 'twitch':
                activity = getTwitchActivity(active as any);
                break;
            case 'osu':
                activity = getOSUActivity(active as any);
                break;
        }

        list.value = [...list.value || [], activity];
    }
});


function getSteamActivity(account: ISteamAccount): IContent {
    let isGame = account?.game?.id,
        steamStatus = [
            { label: 'Offline', icon: 'circle-alt', color: 'var(--text-secondary)' }, 
            { label: 'Online', icon: 'circle', color: 'var(--green)' }, 
            { label: 'Busy', icon: 'quill', color: 'var(--background-secondsry-alt)' }, 
            { label: 'Away', icon: 'pacman', color: 'var(--blue)' }, 
            { label: 'Snooze', icon: 'clock', color: 'var(--yellow)' }, 
            { label: 'Looking to trade', icon: '', color: '' }, 
            { label: 'Looking to play', icon: 'play', color: 'var(--green)' }
        ],
        status = steamStatus[account?.status];

    let buttons = [
        { label: 'Profile', icon: 'user-circle', url: account?.url }
    ];

    if (isGame) buttons = [...buttons, { label: 'Game', icon: 'brush', url: account?.game?.store! }];

    return {
        id: `steam:${account?.id}`,
        name: account?.name,
        details: isGame ? `Playing` : (account?.realname ? `Realname: ${account?.realname}` : undefined),
        state: isGame ? status.label : undefined,
        type: isGame ? 'default' : 'mini',
        largeImage: {
            url: isGame ? account?.game?.capsule! : account?.avatar!,
            label: isGame ? account?.game?.name : 'Steam'
        },
        smallImage: isGame ? {
            url: account?.avatar,
            label: 'Steam'
        } : status,
        buttons
    };
}

function getGitHubActivity(account: IGitHubAccount): IContent {
    let buttons = [
        { label: 'Profile', icon: 'user-circle', url: account?.html_url }
    ];

    if (account?.blog) buttons = [...buttons, { label: 'WebSite', icon: 'link', url: account?.blog }];

    return {
        id: `github:${account?.id}`,
        name: `${account?.name} (${account?.login})`,
        details: `Followers: ${account?.followers}`,
        state: `Public repos: ${account?.public_repos}`,
        largeImage: {
            url: account?.avatar_url,
            label: 'GitHub'
        },
        type: 'default',
        buttons
    }
}

function getTetrActivity(account: ITetrAccount): IContent {
    return {
        id: `tetr:${account?._id}`,
        name: `${account?.username}`,
        details: `${account?.xp} XP`,
        state: `Tetra league: ${Number(account?.league?.rating).toFixed(2)} TR`,
        largeImage: {
            url: account?.avatar_url,
            label: 'Tetr.io'
        },
        // smallImage: {
        //     url: active?.country_flag,
        //     label: active?.country
        // },
        type: 'default',
        buttons: [
            { label: 'Profile', icon: 'user-circle', url: `https://ch.tetr.io/u/${account?.username}` }
        ]
    };
}

function getTwitchActivity(account: ITwitchAccount): IContent {
    return {
        id: `twitch:${account?.id}`,
        name: `${account?.display_name} (${account?.login})`,
        details: account?.description,
        largeImage: {
            url: account?.profile_image_url,
            label: 'Twitch'
        },
        type: 'default',
        buttons: [
            { label: 'Profile', icon: 'user-circle', url: `https://www.twitch.tv/${account?.login}` }
        ]
    }
}

function getOSUActivity(account: IOSUAccount): IContent {
    let buttons = [
        { label: 'Profile', icon: 'user-circle', url: `https://osu.ppy.sh/users/${account?.id}` }
    ];

    if (account?.website) buttons = [...buttons, { label: 'WebSite', icon: 'link', url: account?.website }];

    return {
        id: `osu:${account?.id}`,
        name: `${account?.username}`,
        details: `PP: ${account?.pp}`,
        state: `Global #${account?.global_rank}, Country #${account?.country_rank}`,
        largeImage: {
            url: account?.avatar_url,
            label: 'osu!'
        },
        smallImage: account?.is_online ? {
            icon: 'circle',
            color: 'var(--green)',
            label: `Online`
        } : {
            icon: 'circle-alt',
            color: 'var(--text-secondary)',
            label: `Offline (${time.format(account?.last_visit)})`
        },
        type: 'default',
        buttons
    }
}

</script>

<style lang="scss" scoped>

.activities-enter-active,
.activities-leave-active {
    transform: translateY(-32px);
    opacity: 0;
}

.activities {
    margin: 0 0 0 32px;
    height: 42px;
    position: relative;

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
            border-top: 1px solid var(--background-secondary);

            .activity {
                margin: 0 0 12px 0;

                &:last-child {
                    margin: 0;
                }
            }
        }
    }

    @media (max-width: 740px) {
        margin: 0;
        position: absolute;
        top: 72px;
        left: 50% !important;
        transform: translateX(-50%);

        .data {
            padding: 12px !important;
            min-width: 70vw;
            position: relative;
            top: auto !important;
            left: auto !important;
        }
    }
}

</style>