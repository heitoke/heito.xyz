<template>
    <div :class="['activities', { active: isActive }]" ref="root">
        <Transition name="activities">
            <div :class="['data', { blur: isActive }]"
                @click="open($event, root, () => isActive = true, () => isActive = false)"
            >
                <Activity
                    :content="getFirstActivity"
                    :show-buttons="isActive"
                />

                <Height :show="isActive">
                    <Transition name="transition-fade">
                        <div class="list">
                            <div>
                                <Activity v-for="(activity, idx) of list.slice(track?.id ? 0 : 1)" :key="idx"
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

import type { CurrentPlayingState } from '~/types/api/spotify';
import type {
    TypeAccount,
    AccountActivity,

    SteamActivity,
    GitHubActivity,
    TetrActivity,
    TwitchActivity,
    OSUActivity,
    TelegramActivity,
    DiscordActivity,
    RedditActivity
} from '~/types/sockets/accounts';


const { $api, $socket } = useNuxtApp();

const $user = useUserStore();


const root = ref<HTMLElement | null>(null);


const
    isActive = ref(false),
    track = ref<ActivityContent | null>(null),
    list = ref<Array<ActivityContent>>([]);


let timer: NodeJS.Timeout,
    timerTrackProgress: NodeJS.Timeout;



const getFirstActivity = computed<ActivityContent>(() => {
    const activity = track.value ?? list.value[0];

    return {
        ...activity,
        type: isActive.value ? activity.type : 'mini',
        progress: activity?.progress ? {
            ...activity.progress,
            position: isActive.value ? 'full' : 'content'
        } : undefined
    }
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



// * Sockets
/*
    [string, string] - Icon, Label
*/
const deviceTypes: Record<string, [string, string]> = {
    computer: ['desktop', 'Computer'],
    smartphone: ['mobile', 'Mobile'],
    speaker: ['', 'Speaker']
};

$socket?.on('activities:track:playing', (data: CurrentPlayingState) => {
    if (!data.isPlaying) return;

    const [deviceIcon, deviceLabel] = deviceTypes[data.device.type];

    track.value = {
        id: 'spotify:track',
        type: 'default',
        name: data.track?.name || '',
        state: data.track?.artists?.map(a => a.name).join(', ') || '',
        largePreview: {
            type: 'image',
            url: data.track?.image || ''
        },
        smallPreview: {
            type: 'icon',
            icon: deviceIcon,
            label: deviceLabel,
            color: 'var(--main-color)'
        },
        progress: {
            type: 'time',
            value: data.progress,
            end: data.duration,
            position: 'content'
        },
        buttons: [
            {
                label: 'Profile',
                icon: 'spotify',
                value: 'profile'
            },
            {
                label: 'Open track',
                icon: 'music-note',
                value: 'track'
            },
        ]
    }

    clearTimeout(timer);
    clearTimeout(timerTrackProgress);

    timerTrackProgress = setInterval(() => {
        if (!track.value?.progress?.value) return;

        track.value.progress.value += 1000;
    }, 1000);

    timer = setTimeout(() => {
        track.value = null;
    }, 6000);
});

$socket?.on('activities:list', (activities: Array<AccountActivity>) => {
    list.value = [];

    for (const activity of activities) {
        const convertActivity = new ConvertActivity(activity);

        const result = convertActivity.toActivity();

        if (!result) continue;

        list.value.push(result);
    }
});


// * Set Activity
class ConvertActivity {
    private activity: AccountActivity;

    constructor(activity: AccountActivity) {
        this.activity = activity;
    }


    // * Steam
    private steamStatus = [
        { label: 'Offline', icon: 'circle-alt', color: 'var(--text-secondary)' }, 
        { label: 'Online', icon: 'circle', color: 'var(--green)' }, 
        { label: 'Busy', icon: 'quill', color: 'var(--background-secondsry-alt)' }, 
        { label: 'Away', icon: 'pacman', color: 'var(--blue)' }, 
        { label: 'Snooze', icon: 'clock', color: 'var(--yellow)' }, 
        { label: 'Looking to trade', icon: '', color: '' }, 
        { label: 'Looking to play', icon: 'play', color: 'var(--green)' }
    ];

    private toSteam(): ActivityContent {
        const account = this.activity as SteamActivity;

        const
            game = account.game,
            status = this.steamStatus[account.status];

        const buttons: ActivityContent['buttons'] = [{
            label: 'Profile',
            icon: 'steam',
            value: 'profile'
            // url: account?.url
        }];

        if (game) buttons.push({
            label: 'Game',
            icon: 'brush',
            value: 'game'
            // url: account?.game?.store
        });

        return {
            id: `steam:${account.id}`,
            name: account.name,
            details: game ? `Playing` : `Realname: ${account.realname || ':D'}`,
            state: game ? status.label : undefined,
            type: game ? 'default' : 'mini',
            largePreview: {
                type: 'image',
                label: game ? game?.name : 'Steam',
                url: game ? game?.capsule : account.avatar
            },
            smallPreview: game ? {
                type: 'image',
                label: 'Steam',
                url: account.avatar
            } : {
                type: 'icon',
                ...status
            },
            buttons
        };
    }


    // * GitHub
    private toGitHub(): ActivityContent {
        const account = this.activity as GitHubActivity;

        const buttons: ActivityContent['buttons'] = [{
            label: 'Profile',
            icon: 'github',
            value: 'profile'
            // url: account?.html_url
        }];

        if (account?.blog) buttons.push({
            label: 'WebSite',
            icon: 'link',
            value: 'link'
            // url: account?.blog
        });

        return {
            id: `github:${account.id}`,
            name: `${account?.name} (${account?.login})`,
            details: `Followers: ${account?.followers}`,
            state: `Public repos: ${account?.public_repos}`,
            largePreview: {
                type: 'image',
                label: 'GitHub',
                url: account?.avatar_url
            },
            type: 'default',
            buttons
        }
    }


    // * Tetr
    private toTetr(): ActivityContent {
        const account = this.activity as TetrActivity;

        return {
            id: `tetr:${account._id}`,
            name: `${account?.username}`,
            details: `${account?.xp} XP`,
            state: `Tetra league: ${Number(account?.league?.rating).toFixed(2)} TR`,
            largePreview: {
                type: 'image',
                label: 'Tetr.io',
                url: account?.avatar_url,
            },
            // smallImage: {
            //     url: active?.country_flag,
            //     label: active?.country
            // },
            type: 'default',
            buttons: [{
                label: 'Profile',
                icon: 'tetris-solid',
                value: 'profile'
                // url: `https://ch.tetr.io/u/${account?.username}`
            }]
        }
    }


    // * Twitch
    private toTwitch(): ActivityContent {
        const account = this.activity as TwitchActivity;

        return {
            id: `twitch:${account.id}`,
            name: `${account?.display_name} (${account?.login})`,
            details: account?.description,
            largePreview: {
                type: 'image',
                label: 'Twitch',
                url: account?.profile_image_url
            },
            type: 'mini',
            buttons: [{
                label: 'Profile',
                icon: 'twitch',
                value: 'profile'
                // url: `https://www.twitch.tv/${account?.login}`
            }]
        }
    }


    // * OSU
    private toOSU(): ActivityContent {
        const account = this.activity as OSUActivity;

        let buttons: ActivityContent['buttons'] = [{
            label: 'Profile',
            icon: 'osu-alt',
            value: 'profile'
            // url: `https://osu.ppy.sh/users/${account?.id}`
        }];

        if (account?.website) buttons.push({
            label: 'WebSite',
            icon: 'link',
            value: 'link'
            // url: account?.website
        });

        return {
            id: `osu:${account?.id}`,
            name: `${account?.username}`,
            details: `PP: ${account?.pp}`,
            state: `Global #${account?.global_rank}, Country #${account?.country_rank}`,
            largePreview: {
                type: 'image',
                label: 'osu!',
                url: account?.avatar_url
            },
            smallPreview: account?.is_online ? {
                type: 'icon',
                icon: 'circle',
                color: 'var(--green)',
                label: `Online`
            } : {
                type: 'icon',
                icon: 'circle-alt',
                color: 'var(--text-secondary)',
                label: `Offline (${time.format(account?.last_visit)})`
            },
            type: 'default',
            buttons
        }
    }


    // * Telegram
    private toTelegram(): ActivityContent {
        const account = this.activity as TelegramActivity;

        return {
            id: `telegram:${account?.id}`,
            name: account.username,
            details: `${account?.first_name || ''} ${account?.last_name || ''}`,
            largePreview: {
                type: 'image',
                label: 'Telegram',
                url: `${$api.api.domain}/images/files/tg/${account.id}`
            },
            type: 'mini',
            buttons: [{
                label: 'Profile',
                icon: 'telegram',
                value: 'profile'
                // url: `https://${account.username}.t.me`
            }]
        }
    }


    // * Discord
    private getTypeDiscordFile(hash: string) {
        return hash ? (hash?.includes('a_') ? 'gif' : 'png') : '';
    }

    private toDiscord(): ActivityContent {
        const account = this.activity as DiscordActivity;

        const indexDefaultAvatar = Math.abs((Number(account?.id) >> 22) % 6);

        const
            avatar = `https://cdn.discordapp.com/${account?.avatar ? '' : 'embed/'}avatars${account?.avatar ? '/' + account?.id : ''}/${account?.avatar || indexDefaultAvatar}.${this.getTypeDiscordFile(account?.avatar || 'a')}?size=512`,
            banner = `https://cdn.discordapp.com/banners/${account?.id}/${account?.banner}.${this.getTypeDiscordFile(account?.banner || 'a')}?size=512`;   

        return {
            id: `discord:${account?.id}`,
            type: account?.banner ? 'default' : 'mini',
            name: account.username,
            details: account?.global_name || '',
            state: account?.bot ? 'Bot' : '',
            largePreview: account?.banner || account?.avatar ? {
                type: 'image',
                url: account?.banner ? banner : avatar,
                label: 'Discord'
            } : {} as any,
            smallPreview: account?.banner && account?.avatar ? {
                type: 'image',
                url: avatar
            } : undefined,
            buttons: [
                {
                    label: 'Profile',
                    icon: 'discord',
                    value: 'profile'
                    // url: `https://discord.com/users/${account?.id}`
                },
                {
                    label: 'Server',
                    icon: 'link',
                    value: 'link'
                    // url: `https://discord.gg/48DBJuKcEE`
                }
            ]
        }
    }


    // * Reddit
    private toReddit(): ActivityContent {
        const account = this.activity as RedditActivity;

        const avatarUrl = new URL(account.subreddit.icon_img);
        
        return {
            id: `reddit:${account.name}`,
            name: account.subreddit.title,
            details: 'u/' + account.name,
            type: 'mini',
            largePreview: {
                type: 'image',
                label: 'Reddit',
                url: avatarUrl.origin + avatarUrl.pathname
            },
            buttons: [
                {
                    label: 'Profile',
                    icon: 'reddit',
                    value: 'profile',
                    // url: `https://www.reddit.com/user/${account.name}`
                }
            ]
        }
    }


    toActivity() {
        let convertActivity: ActivityContent | null = null;

        switch(this.activity.typeAccount) {
            case 'steam':
                convertActivity = this.toSteam();
                break;
            case 'github':
                convertActivity = this.toGitHub();
                break;
            case 'tetr':
                convertActivity = this.toTetr();
                break;
            case 'twitch':
                convertActivity = this.toTwitch();
                break;
            case 'osu':
                convertActivity = this.toOSU();
                break;
            case 'telegram':
                convertActivity = this.toTelegram();
                break;
            case 'discord':
                convertActivity = this.toDiscord();
                break;
            case 'reddit':
                convertActivity = this.toReddit();
                break;
        }

        return convertActivity;
    }
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