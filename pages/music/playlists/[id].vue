<template>
    <div class="music-playlist">
        <div class="back" style="margin: 0 0 12px 0;"
            @click="$router.push('/music')"
        >
            <Icon name="arrow-left"/>
            <span>Go back</span>
        </div>

        <Image class="header" :src="getBanner" v-if="!loading && playlist?.id">
            <Image class="image" :src="playlist?.image"/>
    
            <div>
                <Text class="name" :text="playlist.name"/>
                <Text class="text" :text="playlist.description" v-show="playlist.description"/>
    
                <div style="margin: 12px 0 0 0;"></div>
    
                <Text class="text" :text="`Tracks: ${playlist.totalTracks}`"/>
            </div>
    
            <ul class="buttons">
                <li @pointerenter="toolpics.set({ text: 'Open playlist' })" v-show="playlist?.url"
                    @click="redirect(playlist.url)"
                >
                    <Icon name="link"/>
                </li>
            </ul>
        </Image>

        <Loading v-else-if="loading && config.getStatus === 'online'"/>
        
        <Alert v-if="(!loading && !playlist?.id) || config.getStatus === 'offline'"/>

        <div style="margin: 32px 0 0 0;" v-if="getTracks?.length > 0">
            <div class="filters">
                <Textbox label="Search track" @input="filters.text = ($event.target as any)?.value"/>

                <div class="order" style="cursor: pointer; margin: 0 12px;" @click="filters.order = !filters.order">
                    <Icon :name="`sort-amount-${filters.order ? 'down' : 'up'}`"/>
                </div>

                <Select label="Sort" :menu="[
                    {
                        label: 'by Name',
                        icon: 'search-alt',
                        value: 'name'
                    },
                    {
                        label: 'by Duration',
                        icon: 'clock-alt',
                        value: 'duration'
                    },
                    {
                        label: 'by Added',
                        icon: 'clock',
                        value: 'added'
                    },
                    {
                        label: 'by Album',
                        icon: 'text-a',
                        value: 'album'
                    }
                ]" @select="filters.type = $event.value"/>

                <Icon name="info-circle" @pointerenter="toolpics.set({ text: 'Recommend downloading the entire list first!' })" style="margin: 0 0 0 12px;"/>
            </div>

            <ul class="tracks">
                <TransitionGroup name="track">
                    <li v-for="(track, idx) of getSortTracks?.slice(0, count)" :key="track.id"
                        :style="{ '--d': `${(idx * .2) % 10}s` }"
                    >
                        <div class="index">#{{ getTracks.findIndex(t => track.id === t.id) + 1 }}</div>

                        <Image class="image" :src="track.image"/>

                        <div class="name">{{ track.name }}</div>

                        <div style="margin: 0 0 0 auto;"></div>

                        <div class="album">{{ track.album.name }}</div>

                        <div class="l"></div>

                        <div class="added">{{ time.format(track.addedAt) }}</div>

                        <div class="l"></div>

                        <div class="time">{{ msInMin(track.duration) }}</div>

                        <div class="l"></div>

                        <Icon name="play" :class="['btn', { disable: !track?.previewUrl,  active: preview.track?.id === track.id }]"
                            @pointerenter="toolpics.set({ title: track?.previewUrl ? 'Preview track' : 'Disable' })"
                            @click="previewTrack(track)"
                        />

                        <Icon class="btn" name="link" @pointerenter="toolpics.set({ title: 'Open track' })"
                            @click="redirect(track.url)"
                        />
                    </li>
                </TransitionGroup>
            </ul>
        </div>

        <Loading v-if="tracks.loading" style="margin: 12px 0 0 0;"/>

        <Transition name="audio">
            <div class="audio-preview" v-if="preview?.track && preview?.audio">
                <Activity :content="{
                    name: preview?.track?.name,
                    largeImage: {
                        url: preview?.track?.image
                    },
                    progressBar: {
                        value: preview.current * 1000,
                        isTime: true,
                        end: Number(preview.duration + 1) * 1000
                    },
                    type: 'mini'
                }"/>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import Activity from '~/components/header/Activity.vue';

import type { IPlaylistPlus, ITrack } from '~/types/api/music';

import type { IScrollBar } from '~/components/content/ScrollBar.vue';

const { $api } = useNuxtApp();

const route = useRoute();

const
    toolpics = useToolpicsStore(),
    config = useConfigStore();


const props = defineProps({
    scrollProps: { type: Object as PropType<IScrollBar> }
});

const
    filters = ref({
        text: '',
        type: '',
        order: false
    }),
    loading = ref<boolean>(false),
    playlist = ref<IPlaylistPlus>({} as IPlaylistPlus),
    tracks = ref({
        loading: false,
        list: [] as Array<ITrack>,
        total: 0
    }),
    count = ref<number>(10),
    preview = ref({
        track: null as ITrack | null,
        audio: null as HTMLAudioElement | null,
        duration: 0,
        current: 0
    });


const getBanner = computed(() => {
    if (!playlist.value?.id) return '';

    return getAvatar({ nameId: playlist.value?.id, size: 1, type: 'marble' });
});

const getTracks = computed(() => {
    return [...playlist.value?.tracks?.list || [], ...tracks.value.list];
});

const getSortTracks = computed(() => {
    let tracks = [...getTracks.value || []],
        type = filters.value.type;

    const sort = tracks.sort((a, b) => {
        if (type === 'name') return (a.name > b.name) as any;
        if (type === 'duration') return (a.duration < b.duration) as any;
        if (type === 'added') return (a.addedAt! < b.addedAt!) as any;
        if (type === 'album') return (a.album.name > b.album.name) as any;
    });

    if (filters.value.order) sort.reverse(); 

    const regex = new RegExp(filters.value.text.trim(), 'gi');

    return sort.filter(({ name, album }) => regex.test(name) || regex.test(album.name));
});


watch(() => props?.scrollProps?.scroll?.top, (newValue) => {
    const total = tracks.value?.total;
    
    if (tracks.value.loading || (getTracks.value?.length === total && count.value >= total)) return;

    if ((newValue! + 35) >= props.scrollProps?.scroll.max.top!) {
        if (count.value <= getTracks.value.length) {
            count.value += 10;
        } else {
            load();
        }
    }
});



loading.value = true;

const [result, status] = await $api.music.playlist(route.params.id as string);

if (status === 200) {
    loading.value = false;

    playlist.value = result;

    useSeoMeta(seo.createTemplate({
        title: `Playlist - ${result.name}` + ' | Music',
        description: result?.description || '',
        image: result?.image || getAvatar({ nameId: result.id, type: 'marble' })
    }));
}


function load() {
    const playlistId = route.params.playlistId as string;

    switch(playlistId) {
        case "tracks":
            loadSavedTracks(getTracks.value?.length || 0, (getTracks.value?.length || 0) + 50);
            break;
        default:
            if (!playlist.value?.id) {
                loadPlaylist(playlistId);
            } else {
                loadPlaylistTracks();
            }
            break;
    }
}

function msInMin(ms: number) {
    let min = Math.floor((ms / 1000 / 60) << 0),
        sec = Math.floor((ms / 1000) % 60);

    return `${min}:${`${sec}`.length < 2 ? `0${sec}` : sec}`;
}

async function loadPlaylist(playlistId: string) {
    loading.value = true;

    const [result, status] = await $api.music.playlist(playlistId);

    if (status !== 200) return;

    loading.value = false;
    playlist.value = result;
}

async function loadPlaylistTracks() {
    if (!playlist.value?.id) return;
    tracks.value.loading = true;

    const [result, status] = await $api.music.playlistTracks(playlist.value.id, { offset: getTracks.value.length, limit: getTracks.value.length + 100 });
    
    if (status !== 200) {
        tracks.value.loading = false;
        return;
    }
    
    tracks.value = {
        loading: false,
        list: [...tracks.value.list, ...result.results],
        total: result.total
    };
    
    count.value += 10;
}

function previewTrack(track: ITrack) {
    const set = () => {
        preview.value = { track: null, audio: null, duration: 0, current: 0 };
    }

    if (preview.value.audio) {
        preview.value.audio.pause();
        
        if (preview.value.track?.id === track.id) {
            return set();
        }
    }

    if (!track || !track?.previewUrl) return;


    preview.value = {
        track,
        audio: new Audio(track?.previewUrl),
        duration: 0,
        current: 0
    };

    preview.value.audio!.volume = .2;

    preview.value.audio?.addEventListener('durationchange', () => {
        preview.value.duration = preview.value.audio?.duration || 0;
    }, false);

    preview.value.audio?.addEventListener('timeupdate', () => {
        preview.value.current = preview.value.audio?.currentTime || 0;
    });

    preview.value.audio?.play();

    preview.value.audio?.addEventListener("ended", () => set());
}

async function loadSavedTracks(offset: number = 0, limit: number = 50) {
    tracks.value.loading = true;

    const [result, status] = await $api.music.saved('tracks', { offset, limit });

    if (status !== 200) {
        tracks.value.loading = false;
        return;
    }

    tracks.value.loading = false;

    if (playlist.value?.id === 'Saved_Tracks') {
        tracks.value = {
            loading: false,
            list: [...tracks.value?.list || [], ...result.results],
            total: result.total
        };
    } else {
        playlist.value = {
            id: 'Saved_Tracks',
            name: 'Saved tracks',
            image: 'https://cdn.dribbble.com/users/652746/screenshots/2265275/dislike.gif',
            totalTracks: result.total,
            tracks: {
                list: result.results,
                total: result.total
            }
        } as any
    }
}


onMounted(() => {
    const playlistId = route.params.id as string;

    switch(playlistId) {
        case "tracks":
            loadSavedTracks();
            break;
        default:
            loadPlaylist(playlistId);
            break;
    }
});

</script>

<style lang="scss" scoped>

.audio-enter-active,
.audio-leave-active {
    bottom: -48px;
    transition: opacity .5s ease;
    opacity: 0;
}

.track-enter-active,
.track-leave-leave {
    transform: scale(.95) translateY(-25%);
    transition-delay: var(--d);
    opacity: 0;
}

.music-playlist {
    .back {
        cursor: pointer;
        display: flex;
        align-items: center;

        &:hover {
            i, span {
                color: var(--text-primary);
            }
        }

        i {
            margin: 0 4px 0 0;
        }

        i, span {
            color: var(--text-secondary);
            transition: .2s;
        }
    }

    .header {
        display: flex;
        padding: 24px 64px;
        width: 100%;
        height: 256px;
        position: relative;
        border-radius: 7px;
        align-items: center;
        box-sizing: border-box;
        overflow: hidden;

        .image {
            margin: 0 32px 0 0;
            width: 196px;
            height: 196px;
            border-radius: 15px;
            overflow: hidden;
        }

        .image + div {
            .name {
                font-size: 48px;
                font-weight: 700;
            }

            .text {
                color: var(--text-secondary);
            }
        }

        ul.buttons {
            position: absolute;
            top: 24px;
            right: 64px;

            li {
                cursor: pointer;
            }
        }
    }

    .filters {
        display: flex;
        align-items: center;
    }

    ul.tracks {
        margin: 12px 0 0 0;
        border-radius: 7px;
        border: 1px solid var(--background-secondary);

        li {
            display: flex;
            padding: 12px 24px;
            border-bottom: 1px solid var(--background-secondary);
            align-items: center;
            transition: .2s;

            &:last-child() {
                border: none;
            }

            &:hover {
                border-radius: 7px;
                background-color: var(--background-secondary);
                transform: scale(1.02);
                z-index: 1;
            }

            .index {
                width: 48px;
                color: var(--text-secondary);
                font-size: 12px;
                text-align: center;
            }

            .image {
                margin: 0 12px 0 0;
                min-width: 48px;
                height: 48px;
                border-radius: 5px;
                overflow: hidden;
            }

            .l {
                margin: 0 12px;
                height: 24px;
                border-left: 1px solid var(--background-secondary-alt);
            }

            .added, .time {
                color: var(--text-secondary);
                font-size: 12px;
            }

            .btn {
                cursor: pointer;
                margin: 0 8px 0 0;
                color: var(--text-secondary);
                font-size: 14px;
                transition: .2s;

                &:not(.disable) {
                    &:hover {
                        color: var(--main-color);
                    }

                    &.active {
                        color: var(--green);
                    }
                }

                &:last-of-type {
                    margin: 0;
                }


                &.disable {
                    cursor: not-allowed;
                    color: var(--background-secondary-alt);
                }
            }
        }
    }

    .audio-preview {
        padding: 12px;
        position: fixed;
        left: 50%;
        bottom: 12px;
        border-radius: 7px;
        border: 1px solid var(--background-secondary);
        background-color: var(--background-secondary);
        transform: translateX(-50%);
        transition: .2s;
        z-index: 100;
        opacity: .5;

        &:hover {
            opacity: 1;
        }
    }
}

</style>