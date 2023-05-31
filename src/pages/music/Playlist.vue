<template>
    <div class="music-playlist">
        <div class="back" @click="$router.push('/music')">
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
        </header>

        <Loading v-else-if="loading"/>
        <Alert v-else-if="!loading && !playlist?.id"/>

        <ul class="tracks" v-if="getTracks?.length > 0">
            <TransitionGroup name="track">
                <li v-for="(track, idx) of getTracks?.slice(0, count)" :key="track.id"
                    :style="{ '--d': `${(idx * .2) % 10}s` }"
                >
                    <div class="index">#{{ idx + 1}}</div>

                    <div class="image" :style="{ '--image': `url('${track.image}')` }"></div>

                    <div class="name">{{ track.name }}</div>

                    <div style="margin: 0 0 0 auto;"></div>

                    <div class="album">{{ track.album.name }}</div>

                    <div class="time" style="margin: 0 0 0 5%;">{{ msInMin(track.duration) }}</div>
                </li>
            </TransitionGroup>
        </ul>

        <Loading v-if="tracks.loading" style="margin: 12px 0 0 0;"/>
    </div>
</template>

<script lang="ts" setup>

// import CarouselTab from '../components/content/CarouselTab.vue';

// import Artist from '../components/cards/music/Artist.vue';
// import Playlist from '../components/cards/music/Playlist.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { getAvatar } from '../../libs/utils';

import Music, { IPlaylistPlus, ITrack } from '../../libs/api/routes/music';
import Alert from '../../components/UI/Alert.vue';

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
        }
    },
    props: {
        scrollProps: {
            type: Object
        }
    },
    data: () => ({
        loading: false,
        playlist: {} as IPlaylistPlus,
        tracks: {
            loading: false,
            list: [] as Array<ITrack>,
            total: 0
        },
        count: 10
    }),
    watch: {
        "scrollProps.scrollY"(newValue) {
            if (this.tracks.loading || this.getTracks?.length === this.tracks?.total)
                return;
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
        msInMin(ms: number) {
            let min = Math.floor((ms / 1000 / 60) << 0),
            sec = Math.floor((ms / 1000) % 60);
            return `${min}:${`${sec}`.length < 2 ? `0${sec}` : sec}`;
        },
        async loadPlaylist(playlistId: string) {
            this.loading = true;
            const [result, status] = await Music.playlist(playlistId);
            if (status !== 200)
                return;
            this.loading = false;
            this.playlist = result;
        },
        async loadPlaylistTracks() {
            if (!this.playlist?.id)
                return;
            console.log("asdas");
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
        }
    },
    mounted() {
        this.loadPlaylist(this.$route.params.playlistId as string);
    },
    components: { Alert }
});

</script>

<style lang="scss" scoped>

.track-enter-active,
.track-enter-leave {
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
        margin: 12px 0 0 0;
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
    }

    ul.tracks {
        margin: 32px 0 0 0;
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

            .index {
                width: 48px;
                // color: var(--text-secondary);
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
        }
    }
}

</style>