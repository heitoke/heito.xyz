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

import type {
    ISteamAccount,
    IGitHubAccount,
    ITetrAccount,
    ITwitchAccount,
    IOSUAccount,
    ITelegramAccount,
    IDiscordAccount,
    TypeAccount
} from '~/types/sockets/accounts';

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

interface TypeActivity<T = TypeAccount> {
    typeAccount: T;
}

interface SteamAccount extends TypeActivity<'steam'>, ISteamAccount {}
interface GitHubAccount extends TypeActivity<'github'>, IGitHubAccount {}
interface TetrAccount extends TypeActivity<'tetr'>, ITetrAccount {}
interface TwitchAccount extends TypeActivity<'twitch'>, ITwitchAccount {}
interface OSUAccount extends TypeActivity<'osu'>, IOSUAccount {}
interface TelegramAccount extends TypeActivity<'telegram'>, ITelegramAccount {}
interface DiscordAccount extends TypeActivity<'discord'>, IDiscordAccount {}

export type Activity = SteamAccount | GitHubAccount | TetrAccount | TwitchAccount | OSUAccount | TelegramAccount | DiscordAccount;




const { $socket, $api } = useNuxtApp();

const root = ref<HTMLElement | null>(null);

const
    active = ref<boolean>(false),
    miniActive = ref<boolean>(false),
    track = ref<IContent>({} as any),
    list = ref<Array<IContent>>([]);

let timer: NodeJS.Timer,
    timerTrackProgress: NodeJS.Timer;

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
    if (!data?.is_playing) return;
    
    track.value = {
        id: 'spotify:track',
        type: 'mini',
        name: data?.track?.name || '',
        largeImage: {
            url: data?.track?.image || ''
        },
        progressBar: {
            value: data?.track?.start,
            end: data?.track?.end,
            isTime: true
        },
        buttons: [
            { label: 'Profile', icon: 'spotify', url: `https://open.spotify.com/user/${data?.userId}` },
            { label: 'Open track', icon: 'music-note', url: data?.track?.url }
        ]
    }

    if (data?.device) {
        track.value.smallImage = {
            label: data.device?.type,
            icon: data.device?.type === 'Computer' ? 'desktop' : (data.device?.type === 'Smartphone' ? 'mobile' : 'damage-void'),
            color: 'var(--main-color)'
        }
    }
    
    clearTimeout(timer);
    clearTimeout(timerTrackProgress);

    timerTrackProgress = setInterval(() => {
        if (!track.value.progressBar?.value) return;

        track.value.progressBar.value += 1000;
    }, 1000);

    timer = setTimeout(() => {
        track.value = {} as IContent;
    }, 6000);
});


$socket?.on('activities:list', (activities: Array<Activity>) => {
    list.value = [];

    for (let active of activities) {
        let activity: IContent = { name: 'Activity', type: 'default' };

        switch(active?.typeAccount) {
            case 'steam':
                activity = getSteamActivity(active);
                break;
            case 'github':
                activity = getGitHubActivity(active);
                break;
            case 'tetr':
                activity = getTetrActivity(active);
                break;
            case 'twitch':
                activity = getTwitchActivity(active);
                break;
            case 'osu':
                activity = getOSUActivity(active);
                break;
            case 'telegram':
                activity = getTelegramActivity(active);
                break;
            case 'discord':
                activity = getDiscordActivity(active);
                break;
        }

        list.value = [...list.value || [], activity];
    }
});


function getSteamActivity(account: SteamAccount): IContent {
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
        { label: 'Profile', icon: 'steam', url: account?.url }
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

function getGitHubActivity(account: GitHubAccount): IContent {
    let buttons = [
        { label: 'Profile', icon: 'github', url: account?.html_url }
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

function getTetrActivity(account: TetrAccount): IContent {
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
            { label: 'Profile', icon: 'tetris-solid', url: `https://ch.tetr.io/u/${account?.username}` }
        ]
    };
}

function getTwitchActivity(account: TwitchAccount): IContent {
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
            { label: 'Profile', icon: 'twitch', url: `https://www.twitch.tv/${account?.login}` }
        ]
    }
}

function getOSUActivity(account: OSUAccount): IContent {
    let buttons = [
        { label: 'Profile', icon: 'osu-alt', url: `https://osu.ppy.sh/users/${account?.id}` }
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

function getTelegramActivity(account: TelegramAccount): IContent {
    return {
        id: `telegram:${account?.id}`,
        name: account.username,
        details: `${account?.first_name || ''} ${account?.last_name || ''}`,
        largeImage: {
            url: `${$api.domain}/files/telegram-user-${account.id}.jpg`,
            label: 'Telegram'
        },
        type: 'mini',
        buttons: [
            { label: 'Profile', icon: 'telegram', url: `https://${account.username}.t.me` }
        ]
    }
}

function getDiscordActivity(account: DiscordAccount): IContent {
    const
        getTypeFile = (hash: string) => hash ? (hash?.includes('a_') ? 'gif' : 'png') : '',
        index = Math.abs((Number(account?.id) >> 22) % 6),
        avatar = `https://cdn.discordapp.com/${account?.avatar ? '' : 'embed/'}avatars${account?.avatar ? '/' + account?.id : ''}/${account?.avatar || index}.${getTypeFile(account?.avatar || 'a')}?size=512`,
        banner = `https://cdn.discordapp.com/banners/${account?.id}/${account?.banner}.${getTypeFile(account?.banner || 'a')}?size=512`;

    return {
        id: `discord:${account?.id}`,
        type: account?.banner ? 'default' : 'mini',
        name: account.username,
        details: account?.global_name || '',
        state: account?.bot ? 'Bot' : '',
        largeImage: account?.banner || account?.avatar ? {
            url: account?.banner ? banner : avatar,
            label: 'Discord'
        } : {} as any,
        smallImage: account?.banner && account?.avatar ? {
            url: avatar
        } : {},
        buttons: [
            { label: 'Profile', icon: 'discord', url: `https://discord.com/users/${account?.id}` },
            { label: 'Server', icon: 'link', url: `https://discord.gg/48DBJuKcEE` }
        ]
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