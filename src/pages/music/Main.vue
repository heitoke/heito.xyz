<template>
    <div class="music">
        <div class="header">
            <div style="display: flex; align-items: center;">
                <Icon name="spotify" style="margin: 0 12px 0 0; font-size: 32px;"/>
                <Text text="Spotify" style="font-size: 20px;"/>
            </div>
        </div>

        <div class="grid" style="display: grid; grid-template-columns: repeat(2, calc(100% / 2));">
            <div style="display: flex; margin: 0 16px 0 0; flex-direction: column; justify-content: space-between;">
                <section class="recently">
                    <Text class="title" text="Recently"/>

                    <CarouselTab :gap="12" :column="2" v-if="!recently.loading && recently.list.length > 0">
                        <Track v-for="track of recently.list" :key="track.id"
                            :track="(track as ITrack)"
                            style="margin: 4px 0;"
                        />
                    </CarouselTab>

                    <Loading v-else-if="recently.loading"/>

                    <Alert v-else-if="!recently.loading && recently.list.length < 1"/>
                </section>

                <section class="top tracks">
                    <Text class="title" text="Top tracks"/>

                    <CarouselTab :gap="12" :column="2" v-if="!top.tracks.loading && top.tracks.list.length > 0">
                        <Track v-for="track of top.tracks.list" :key="track.id"
                            :track="track"
                            style="margin: 4px 0;"
                        />
                    </CarouselTab>

                    <Loading v-else-if="top.tracks.loading"/>

                    <Alert v-else-if="!top.tracks.loading && top.tracks.list.length < 1"/>
                </section>
            </div>

            <section class="top artists" style="margin: 0 0 0 16px;">
                <Text class="title" text="Top artists"/>

                <CarouselTab :gap="12" :column="3" v-if="!top.artists.loading && top.artists.list.length > 0">
                    <Artist v-for="artist of top.artists.list" :key="artist.id"
                        :artist="artist"
                        style="margin: 2px 0;"
                    />
                </CarouselTab>

                <Loading v-else-if="top.artists.loading"/>

                <Alert v-else-if="!top.artists.loading && top.artists.list.length < 1"/>
            </section>
        </div>

        <div style="margin: 48px 0 0 0;"></div>

        <RouterView v-if="$route.name === 'MusicPlaylistPage'"
            :scrollProps="scrollProps"
        ></RouterView>

        <section class="playlists" v-else>
            <Text class="title" text="Playlists"/>

            <ul v-if="!playlists.loading && playlists.list.length > 0">
                <Playlist v-for="playlist of playlists.list" :key="playlist.id"
                    :playlist="playlist"
                    style="cursor: pointer;"
                    @click="$router.push(`/music/playlists/${playlist.id}`)"
                />
            </ul>

            <Loading v-else-if="playlists.loading"/>

            <Alert v-else-if="!playlists.loading && playlists.list.length < 1"/>
        </section>
    </div>
</template>

<script lang="ts" setup>

import CarouselTab from '../../components/content/CarouselTab.vue';

import Track from '../../components/cards/music/Track.vue';
import Artist from '../../components/cards/music/Artist.vue';
import Playlist from '../../components/cards/music/Playlist.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import Music, { IArtist, IPlaylist, IRecentlyTrack, ITrack } from '../../libs/api/routes/music';

export default defineComponent({
    name: "MusicPage",
    computed: {},
    props: {
        scrollProps: {
            type: Object
        }
    },
    data: () => ({
        top: {
            tracks: {
                loading: false,
                list: [] as Array<ITrack>
            },
            artists: {
                loading: false,
                list: [] as Array<IArtist>
            }
        },
        recently: {
            loading: false,
            list: [] as Array<IRecentlyTrack>
        },
        playlists: {
            loading: false,
            list: [] as Array<IPlaylist>
        }
    }),
    watch: {},
    methods: {
        async loadTopTracks(type: 'tracks' | 'artists' = 'tracks') {
            this.top[type].loading = true;

            const [result, status] = await Music.top(type);

            if (status !== 200) return;

            this.top[type] = {
                loading: false,
                list: result.results as any
            }
        },
        async loadRecently() {
            this.recently.loading = true;

            const [result, status] = await Music.recently();

            if (status !== 200) return;

            this.recently = {
                loading: false,
                list: result.results
            }
        },
        async loadPlaylists() {
            this.playlists.loading = true;

            const [result, status] = await Music.playlists();

            if (status !== 200) return;

            this.playlists = {
                loading: false,
                list: result.results
            }
        }
    },
    mounted() {
        this.loadTopTracks();
        this.loadTopTracks('artists');

        this.loadRecently();

        this.loadPlaylists();
    }
});

</script>

<style lang="scss" scoped>

.music {
    margin: 32px 0;
    padding: 0 10%;

    .header {
        margin: 0 0 32px 0;
        padding: 12px 24px;
        border-radius: 7px;
        border: 3px dashed var(--main-color-alt);
    }

    .title {
        margin: 0 0 12px 0;
        font-size: 24px;
        font-weight: 600;
    }

    section.playlists {
        ul {
            display: grid;
            grid-template-columns: repeat(6, calc(100% / 6));
        }
    }
}

</style>