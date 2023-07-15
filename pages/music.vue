<template>
    <div class="music">
        <div class="header">
            <div style="display: flex; align-items: center;">
                <Icon name="spotify" style="margin: 0 12px 0 0; font-size: 32px;"/>
                <Text text="Spotify" style="font-size: 20px;"/>
            </div>
        </div>

        <div class="grid">
            <div class="tops">
                <section class="recently">
                    <header style="display: flex;">
                        <Text class="title" text="Recently"/>

                        <Skeleton style="width: 24px; height: 24px;" :show="!recently.loading && recently.list.length > 0" v-if="config.getStatus === 'online'">
                            <Icon name="damage-void" class="reload"
                                @pointerenter="toolpics.set({ text: 'Reload' })"
                                @click="loadRecently()"
                            />
                        </Skeleton>
                    </header>

                    <CarouselTab :gap="12" :column="$win.size.width > 740 ? 2 : 1" v-if="!recently.loading && recently.list.length > 0">
                        <Track v-for="track of recently.list" :key="track.id"
                            :track="(track as ITrack)"
                            style="margin: 4px 0;"
                        />
                    </CarouselTab>

                    <Loading v-else-if="recently.loading && config.getStatus === 'online'"/>

                    <Alert type="mini" v-if="(!recently.loading && recently.list.length < 1) || config.getStatus === 'offline'"/>
                </section>

                <section class="top tracks" style="margin: 12px 0 0 0;">
                    <header>
                        <Text class="title" text="Top tracks"/>

                        <Skeleton style="width: 169px; height: 32px;" :show="!top.tracks.loading && top.tracks.list.length > 0" v-if="config.getStatus === 'online'">
                            <Select label="Period" :value="top.tracks.period" :menu="termMenu" @select="loadTopTracks('tracks', $event.value as any)"/>
                        </Skeleton>
                    </header>

                    <CarouselTab :gap="12" :column="$win.size.width > 740 ? 2 : 1" v-if="!top.tracks.loading && top.tracks.list.length > 0">
                        <Track v-for="track of top.tracks.list" :key="track.id"
                            :track="track"
                            style="margin: 4px 0;"
                        />
                    </CarouselTab>

                    <Loading v-else-if="top.tracks.loading && config.getStatus === 'online'"/>

                    <Alert type="mini" v-if="(!top.tracks.loading && top.tracks.list.length < 1) || config.getStatus === 'offline'"/>
                </section>
            </div>

            <section class="top artists" style="margin: 0 0 0 16px;">
                <header>
                    <Text class="title" text="Top artists"/>

                    <Skeleton style="width: 169px; height: 32px;" :show="!top.artists.loading && top.artists.list.length > 0" v-if="config.getStatus === 'online'">
                        <Select label="Period" :value="top.artists.period" :menu="termMenu" @select="loadTopTracks('artists', $event.value as any)"/>
                    </Skeleton>
                </header>

                <CarouselTab :gap="12" :column="$win.size.width > 540 ? 3 : 2" v-if="!top.artists.loading && top.artists.list.length > 0">
                    <Artist v-for="artist of top.artists.list" :key="artist.id"
                        :artist="artist"
                        style="margin: 2px 0;"
                    />
                </CarouselTab>

                <Loading v-else-if="top.artists.loading && config.getStatus === 'online'"/>

                <Alert type="mini" v-if="(!top.artists.loading && top.artists.list.length < 1) || config.getStatus === 'offline'"/>
            </section>
        </div>

        <div style="margin: 48px 0 0 0;"></div>

        <NuxtPage v-if="route.name === 'music-playlists-id'"
            :scrollProps="scrollProps"
        />


        <section class="playlists" v-else>
            <Text class="title" text="Playlists"/>

            <ul v-if="!playlists.loading && playlists.list.length > 0">
                <Playlist :playlist="(playlistSavedTracks as IPlaylist)"
                    style="cursor: pointer;"
                    @click="$router.push(`/music/playlists/tracks`)"
                />

                <Playlist v-for="playlist of playlists.list" :key="playlist.id"
                    :playlist="playlist"
                    style="cursor: pointer;"
                    @click="$router.push(`/music/playlists/${playlist.id}`)"
                />
            </ul>

            <Loading v-else-if="playlists.loading && config.getStatus === 'online'"/>

            <Alert style="margin: 12px 0 0 0;" v-if="(!playlists.loading && playlists.list.length < 1) || config.getStatus === 'offline'"/>
        </section>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import CarouselTab from '~/components/content/containers/CarouselTab.vue';

import Track from '~/components/models/music/cards/Track.vue';
import Artist from '~/components/models/music/cards/Artist.vue';
import Playlist from '~/components/models/music/cards/Playlist.vue';

import type { IArtist, IPlaylist, IRecentlyTrack, ITrack } from '~/types/api/music';

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
    top = ref({
        tracks: {
            loading: false,
            period: 'medium',
            list: [] as Array<ITrack>,
            lastedAt: 0
        },
        artists: {
            loading: false,
            period: 'medium',
            list: [] as Array<IArtist>,
            lastedAt: 0
        }
    }),
    recently = ref({
        loading: false,
        list: [] as Array<IRecentlyTrack>,
        lastedAt: 0
    }),
    playlists = ref({
        loading: false,
        list: [] as Array<IPlaylist>
    });


const termMenu = [
    {
        label: 'For all the time',
        value: 'long'
    },
    {
        label: 'For 6 months',
        value: 'medium'
    },
    {
        label: 'For 4 weeks',
        value: 'short'
    }
];

const playlistSavedTracks = {
    name: 'Saved Tracks',
    image: 'https://cdn.dribbble.com/users/652746/screenshots/2265275/dislike.gif'
};


watch(() => route.name, newValue => {
    if (newValue !== 'MusicPlaylistPage') {
        loadPlaylists();
    }
});



async function loadTopTracks(type: 'tracks' | 'artists' = 'tracks', term: 'long' | 'medium' | 'short' = 'medium') {
    top.value[type].loading = true;

    const [result, status] = await $api.music.top(type, { term } as any);

    if (status !== 200) return;

    top.value[type] = {
        loading: false,
        period: term,
        list: result.results as any,
        lastedAt: Date.now()
    }
}

async function loadRecently() {
    recently.value.loading = true;

    const [result, status] = await $api.music.recently();

    if (status !== 200) return;

    recently.value = {
        loading: false,
        list: result.results,
        lastedAt: Date.now()
    }
}

async function loadPlaylists() {
    playlists.value.loading = true;

    const [result, status] = await $api.music.playlists();

    if (status !== 200) return;

    playlists.value = {
        loading: false,
        list: result.results
    }
}


useSeoMeta({
    title: 'Music'
});

definePageMeta({
    title: 'Music',
    icon: 'music-note'
});


onMounted(() => {
    loadTopTracks();
    loadTopTracks('artists');

    loadRecently();

    if (route.name !== 'MusicPlaylistPage') {
        loadPlaylists();
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

    .grid {
        display: grid;
        grid-template-columns: repeat(2, calc(100% / 2));
    }

    .tops {
        display: flex;
        margin: 0 16px 0 0;
        flex-direction: column;
        justify-content: space-between;
    }

    .title {
        font-size: 24px;
        font-weight: 600;
    }

    section {
        header {
            display: flex;
            margin: 0 0 12px 0;
            align-items: center;
            justify-content: space-between;

            .reload {
                cursor: pointer;
                color: var(--text-secondary);
                transition: .2s;

                &:hover {
                    color: var(--main-color);
                }
            }
        }
    }

    section.playlists {
        ul {
            display: grid;
            grid-template-columns: repeat(6, calc(100% / 6));
        }
    }

    @media (max-width: 1040px) {
        .grid {
            display: block;
        }

        .tops {
            display: block;
            margin: 0;
        }

        .top {
            margin: 0 !important;
        }

        section {
            header {
                margin: 12px 0;
            }
        }

        section.playlists {
            ul {
                display: grid;
                grid-template-columns: repeat(5, calc(100% / 5));
            }
        }
    }

    @media (max-width: 840px) {
        section.playlists {
            ul {
                display: grid;
                grid-template-columns: repeat(4, calc(100% / 4));
            }
        }
    }

    @media (max-width: 740px) {
        padding: 0 5%;

        section {
            header {
                display: block;

                .ui-select {
                    margin: 12px 0 0 0;
                }
            }
        }

        section.playlists {
            ul {
                display: grid;
                grid-template-columns: repeat(3, calc(100% / 3));
            }
        }
    }

    @media (max-width: 540px) {
        section.playlists {
            ul {
                display: grid;
                grid-template-columns: repeat(2, calc(100% / 2));
            }
        }
    }
}

</style>