<template>
    <div class="music-playlist">
        <div class="back" style="margin: 0 0 12px 0;"
            @click="$router.push('/music')"
        >
            <Icon name="arrow-left"/>
            <span>Go back</span>
        </div>

        <header :style="{ '--banner': `url('${getBanner}')` }" v-if="!loading && playlist?.id">
            <div class="image" :style="{ '--image': `url('${playlist?.image}')` }"></div>

            <div>
                <Text class="name" :text="playlist.name"/>
                <Text class="text" :text="playlist.description" v-show="playlist.description"/>

                <div style="margin: 12px 0 0 0;"></div>

                <Text class="text" :text="`Tracks: ${playlist.totalTracks}`"/>
            </div>

            <ul class="buttons">
                <li @pointerenter="setToolpic({ text: 'Open playlist' })"
                    @click="redirect(playlist.url)"
                >
                    <Icon name="link"/>
                </li>
            </ul>
        </header>

        <Loading v-else-if="loading"/>
        <Alert v-else-if="!loading && !playlist?.id"/>

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

                <Icon name="info-circle" @pointerenter="setToolpic({ text: 'Recommend downloading the entire list first!' })" style="margin: 0 0 0 12px;"/>
            </div>

            <ul class="tracks">
                <TransitionGroup name="track">
                    <li v-for="(track, idx) of getSortTracks?.slice(0, count)" :key="track.id"
                        :style="{ '--d': `${(idx * .2) % 10}s` }"
                    >
                        <div class="index">#{{ getTracks.findIndex(t => track.id === t.id) + 1 }}</div>

                        <div class="image" :style="{ '--image': `url('${track.image}')` }"></div>

                        <div class="name">{{ track.name }}</div>

                        <div style="margin: 0 0 0 auto;"></div>

                        <div class="album">{{ track.album.name }}</div>

                        <div class="l"></div>

                        <div class="added">{{ time.format(track.addedAt) }}</div>

                        <div class="l"></div>

                        <div class="time">{{ msInMin(track.duration) }}</div>

                        <div class="l"></div>

                        <Icon name="play" :class="['btn', { disable: !track?.previewUrl,  active: preview.track?.id === track.id }]"
                            @pointerenter="setToolpic({ title: track?.previewUrl ? 'Preview track' : 'Disable' })"
                            @click="previewTrack(track)"
                        />

                        <Icon class="btn" name="link" @pointerenter="setToolpic({ title: 'Open track' })"
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

import { time, redirect } from '../../libs/utils';

import Activity from '../../components/content/Activity.vue';

</script>

<script lang="ts">

import { defineComponent, reactive } from 'vue';

import { mapActions } from 'vuex';

import { getAvatar } from '../../libs/utils';

import Music, { IPlaylistPlus, ITrack } from '../../libs/api/routes/music';

export default defineComponent({
    name: "MusicPlaylistPage",
    computed: {
        getBanner(): string {
            if (!this.playlist?.id)
                return "";
            return getAvatar({ nameId: this.playlist?.id as string, size: window.innerWidth, type: "marble" });
        },
        getTracks(): Array<ITrack> {
            return [...this.playlist?.tracks?.list || [], ...this.tracks.list];
        },
        getSortTracks() {
            let tracks = [...this.getTracks || []],
                type = this.filters.type;

            const sort = tracks.sort((a, b) => {
                if (type === 'name') return (a.name > b.name) as any;
                if (type === 'duration') return (a.duration < b.duration) as any;
                if (type === 'added') return (a.addedAt! < b.addedAt!) as any;
                if (type === 'album') return (a.album.name > b.album.name) as any;
            });

            if (this.filters.order) sort.reverse(); 

            const regex = new RegExp(this.filters.text.trim(), 'gi');

            return sort.filter(({ name, album }) => regex.test(name) || regex.test(album.name));
        }
    },
    props: {
        scrollProps: {
            type: Object
        }
    },
    data: () => ({
        filters: {
            text: '',
            type: '',
            order: false
        },
        loading: false,
        playlist: {} as IPlaylistPlus,
        tracks: {
            loading: false,
            list: [] as Array<ITrack>,
            total: 0
        },
        count: 10,
        preview: {
            track: null as ITrack | null,
            audio: null as HTMLAudioElement | null,
            duration: 0,
            current: 0
        }
    }),
    watch: {
        "scrollProps.scrollY"(newValue) {
            const total = this.tracks?.total;

            if (this.tracks.loading || (this.getTracks?.length === total && this.count >= total)) return;

            if ((newValue + 35) >= this.scrollProps?.scrollMaxHeight) {
                if (this.count <= this.getTracks.length) {
                    this.count += 10;
                }
                else {
                    this.loadPlaylistTracks();
                }
            }
        }
    },
    methods: {
        ...mapActions(["setToolpic"]),
        msInMin(ms: number) {
            let min = Math.floor((ms / 1000 / 60) << 0),
                sec = Math.floor((ms / 1000) % 60);

            return `${min}:${`${sec}`.length < 2 ? `0${sec}` : sec}`;
        },
        async loadPlaylist(playlistId: string) {
            this.loading = true;

            const [result, status] = await Music.playlist(playlistId);

            if (status !== 200) return;

            this.loading = false;
            this.playlist = result;
        },
        async loadPlaylistTracks() {
            if (!this.playlist?.id) return;
            this.tracks.loading = true;

            const [result, status] = await Music.playlistTracks(this.playlist.id, { offset: this.getTracks.length, limit: this.getTracks.length + 100 });
            
            if (status !== 200) {
                this.tracks.loading = false;
                return;
            }
            
            this.tracks = {
                loading: false,
                list: [...this.tracks.list, ...result.results],
                total: result.total
            };
            
            this.count += 10;
        },
        previewTrack(track: ITrack) {
            const set = () => {
                this.preview = { track: null, audio: null, duration: 0, current: 0 };
            }

            if (this.preview.audio) {
                this.preview.audio.pause();
                
                if (this.preview.track?.id === track.id) {
                    return set();
                }
            }

            if (!track || !track?.previewUrl) return;


            this.preview = {
                track,
                audio: new Audio(track?.previewUrl),
                duration: 0,
                current: 0
            };

            this.preview.audio!.volume = .2;

            this.preview.audio?.addEventListener('durationchange', () => {
                this.preview.duration = this.preview.audio?.duration || 0;
            }, false);

            this.preview.audio?.addEventListener('timeupdate', () => {
                this.preview.current = this.preview.audio?.currentTime || 0;
            });

            this.preview.audio?.play();

            this.preview.audio?.addEventListener("ended", () => set());
        }
    },
    mounted() {
        this.loadPlaylist(this.$route.params.playlistId as string);
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

    header {
        display: flex;
        padding: 24px 64px;
        width: 100%;
        height: 256px;
        position: relative;
        border-radius: 7px;
        align-items: center;
        box-sizing: border-box;
        overflow: hidden;
        
        &::after {
            content: " ";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-size: cover;
            background-position: center;
            background-image: var(--banner);
            // background: linear-gradient(75deg, var(--background-secondary-alt) 0%, var(--main-color-alt) 40%, var(--main-color) 60%, var(--green) 70%, var(--green-alt) 80%, #757ecb 100%);
            opacity: .7;
            z-index: -1;
        }

        .image {
            margin: 0 32px 0 0;
            width: 196px;
            height: 196px;
            border-radius: 15px;
            background-size: cover;
            background-position: center;
            background-image: var(--image);
            background-color: var(--background-secondary-alt);
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
                background-size: cover;
                background-position: center;
                background-image: var(--image);
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