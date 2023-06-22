<template>
    <div :class="['activities', { active }]" ref="activities">
        <Transition name="activities">
            <div :class="['data', { blur: active }]" v-if="track?.id || list?.length > 0"
                @click="open($event, 'activities', () => active = true, () => active = false)"
            >
                <Activity :show-buttons="active" :content="{
                    ...(track?.id ? track : list[0]),
                    type: active ? 'default' : 'mini'
                }"/>
    
                <ScrollBar :max-height="'256px'" v-if="active && list?.length > (track.id ? 0 : 1)">
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
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

import Activity, { type IContent } from '../content/Activity.vue';

import ScrollBar from '../content/ScrollBar.vue';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { time } from '../../libs/utils';

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

export default defineComponent({
    name: 'HeaderActivities',
    computed: {},
    // props: {},
    data: () => ({
        active: false,
        track: {} as IContent,
        list: [] as Array<IContent>,
        timer: {} as NodeJS.Timeout
    }),
    watch: {},
    sockets: {
        'activities:track:playing'(data: { device: any, userId: string, track: TTrack, is_playing: boolean }) {
            if (!data.is_playing) return;

            this.track = {
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

            clearTimeout(this.timer);

            this.timer = setTimeout(() => {
                this.track = {} as IContent;
            }, 6000);
        },
        'activities:list'(activitiesList: Array<{ type: 'steam' | 'github' | 'tetr' | 'twitch' | 'osu', [key: string]: any }>) {
            this.list = [];

            for (let active of activitiesList) {
                let activity: IContent = { name: 'Activity', type: 'default' };

                switch(active?.type) {
                    case 'steam':
                        let isGame = active?.game?.id,
                            steamStatus = [
                                { label: 'Offline', icon: 'circle-alt', color: 'var(--text-secondary)' }, 
                                { label: 'Online', icon: 'circle', color: 'var(--green)' }, 
                                { label: 'Busy', icon: 'quill', color: 'var(--background-secondsry-alt)' }, 
                                { label: 'Away', icon: 'pacman', color: 'var(--blue)' }, 
                                { label: 'Snooze', icon: 'clock', color: 'var(--yellow)' }, 
                                { label: 'Looking to trade', icon: '', color: '' }, 
                                { label: 'Looking to play', icon: 'play', color: 'var(--green)' }
                            ],
                            status = steamStatus[active?.status];

                        activity = {
                            id: `steam:${active?.id}`,
                            name: active?.name,
                            details: isGame ? `Playing` : (active?.realname ? `Realname: ${active?.realname}` : undefined),
                            state: isGame ? status.label : undefined,
                            type: isGame ? 'default' : 'mini',
                            largeImage: {
                                url: isGame ? active?.game?.capsule : active?.avatar,
                                label: isGame ? active?.game?.name : 'Steam'
                            },
                            smallImage: isGame ? {
                                url: active?.avatar,
                                label: 'Steam'
                            } : status,
                            buttons: [
                                { label: 'Profile', icon: 'user-circle', url: active?.url }
                            ]
                        };

                        if (isGame) activity['buttons']?.push({ label: 'Game', icon: 'brush', url: active?.game?.store });
                        break;
                    case 'github':
                        activity = {
                            id: `github:${active?.id}`,
                            name: `${active?.name} (${active?.login})`,
                            details: `Followers: ${active?.followers}`,
                            state: `Public repos: ${active?.public_repos}`,
                            largeImage: {
                                url: active?.avatar_url,
                                label: 'GitHub'
                            },
                            type: 'default',
                            buttons: [
                                { label: 'Profile', icon: 'user-circle', url: active?.html_url }
                            ]
                        };

                        if (active?.blog) activity['buttons']?.push({ label: 'WebSite', icon: 'link', url: active?.blog });
                        break;
                    case 'tetr':
                        activity = {
                            id: `tetr:${active?._id}`,
                            name: `${active?.username}`,
                            details: `${active?.xp} XP`,
                            state: `Tetra league: ${Number(active?.league?.rating).toFixed(2)} TR`,
                            largeImage: {
                                url: active?.avatar_url,
                                label: 'Tetr.io'
                            },
                            // smallImage: {
                            //     url: active?.country_flag,
                            //     label: active?.country
                            // },
                            type: 'default',
                            buttons: [
                                { label: 'Profile', icon: 'user-circle', url: `https://ch.tetr.io/u/${active?.username}` }
                            ]
                        };
                        break;
                    case 'twitch':
                        activity = {
                            id: `twitch:${active?.id}`,
                            name: `${active?.display_name} (${active?.login})`,
                            details: active?.description,
                            largeImage: {
                                url: active?.profile_image_url,
                                label: 'Twitch'
                            },
                            type: 'default',
                            buttons: [
                                { label: 'Profile', icon: 'user-circle', url: `https://www.twitch.tv/${active?.login}` }
                            ]
                        };
                        break;
                    case 'osu':
                        activity = {
                            id: `osu:${active?.id}`,
                            name: `${active?.username}`,
                            details: `PP: ${active?.pp}`,
                            state: `Global #${active?.global_rank}, Country #${active?.country_rank}`,
                            largeImage: {
                                url: active?.avatar_url,
                                label: 'osu!'
                            },
                            smallImage: active?.is_online ? {
                                icon: 'circle',
                                color: 'var(--green)',
                                label: `Online`
                            } : {
                                icon: 'circle-alt',
                                color: 'var(--text-secondary)',
                                label: `Offline (${time.format(active?.last_visit)})`
                            },
                            type: 'default',
                            buttons: [
                                { label: 'Profile', icon: 'user-circle', url: `https://osu.ppy.sh/users/${active?.id}` }
                            ]
                        };

                        if (active?.website) activity['buttons']?.push({ label: 'WebSite', icon: 'link', url: active?.website });
                        break;
                }

                this.list = [...this.list || [], activity];
            }

        }
    },
    methods: {
        open(e: Event, ref: string, callbackTrue: Function = () => {}, callbackFalse: Function = () => {}) {
            callbackTrue();

            let close = () => {
                window.addEventListener('click', (e) => {
                    if ((this.$refs[ref] as any)?.contains(e.target)) return close();
                    
                    callbackFalse();
                }, { once: true });
            }

            setTimeout(() => close(), 10);
        }
    },
    mounted() {}
})

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
            padding: 12px;
            top: calc(50% - 24px);
            left: -12px;
            border-color: var(--background-secondary);
        }
    }

    &.active {
        .data {
            cursor: auto;

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

}

</style>