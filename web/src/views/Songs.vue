<template>
    <div class="songs">
        <div class="block">
            <div class="bar">
                <Select v-if="accounts.length > 0" :items="accounts" :value="selAccountId" @onEvent="selectAccount($event.value)"/>
                <div class="play" v-if="activity && activity?.activity !== false">
                    <img :src="activity?.largeImage?.value">
                    <div class="name">{{ activity?.name }}</div>
                </div>
            </div>
            <div class="group">
                <div>
                    <div class="subtitle">Top tracks</div>
                    <ul class="list" v-if="tracks">
                        <SongTrackCard v-for="track of hide.tracks ? tracks.items.slice(0, 5) : tracks.items" :key="track" :data="track"/>
                    </ul>
                    <div class="subtitle click" @click="hide.tracks = !hide.tracks">{{ hide.tracks ? 'Expand' : 'Roll up' }}</div>
                </div>
                <div>
                    <div class="subtitle">Top artists</div>
                    <ul class="list" v-if="artists">
                        <SongArtistCard v-for="artist of hide.artists ? artists.items.slice(0, 5) : artists.items" :key="artist" :data="artist"/>
                    </ul>
                    <div class="subtitle click" @click="hide.artists = !hide.artists">{{ hide.artists ? 'Expand' : 'Roll up' }}</div>
                </div>
                <div>
                    <div class="subtitle">Recent songs</div>
                    <ul class="list" v-if="history">
                        <SongTrackCard v-for="track of hide.history ? history.items.slice(0, 5) : history.items" :key="track" :data="track.track">
                            <div class="date">{{ timeago(track?.played_at) }}</div>
                        </SongTrackCard>
                    </ul>
                    <div class="subtitle click" @click="hide.history = !hide.history">{{ hide.history ? 'Expand' : 'Roll up' }}</div>
                </div>
            </div>
            <div class="subtitle">Playlists</div>
            <ul class="list playlists" v-if="history">
                <SongPlaylistCard v-for="playlist of hide.playlists ? playlists.items.slice(0, 5) : playlists.items" :key="playlist" :data="playlist"/>
            </ul>
            <div class="subtitle click" @click="hide.playlists = !hide.playlists">{{ hide.playlists ? 'Expand' : 'Roll up' }}</div>
        </div>
    </div>
</template>

<script>

import { defineAsyncComponent } from 'vue';

export default {
    name: 'SongsPage',
    components: {
            SongTrackCard: defineAsyncComponent(() => import('../components/song/cardTrack.vue')),
        SongArtistCard: defineAsyncComponent(() => import('../components/song/cardArtist.vue')),
        SongPlaylistCard: defineAsyncComponent(() => import('../components/song/cardPlaylist.vue')) },
    computed: {},
    data() {
        return {
            tracks: null,
            artists: null,
            history: null,
            hide: {
                tracks: true,
                artists: true,
                history: true,
                playlists: true
            },
            accounts: [],
            selAccountId: '',
            activity: null,
            playlists: []
        }
    },
    methods: {
        async loadAccounts() {
            let services = await this.fetch('/services');
            for (let { key } of services.filter(item => item.type === 'spotify')) {
                let account = await this.fetch(`/services/account/spotify/${key}`),
                    { display_name, images, id } = account;
                this.accounts = [ ...this.accounts, { label: display_name, icon: images[0].url, value: id } ];
            }
            if (this.accounts.length < 1) return;
            this.selectAccount(this.accounts[0].value);
        },
        async load(type = '') {
            // artists | tracks
            this[type] = await this.fetch(`/songs/top/${type}/${this.selAccountId}`);
        },
        async loadHistory() {
            this.history = await this.fetch(`/songs/history/${this.selAccountId}`);
        },
        async loadActivity() {
            let activity = await this.fetch(`/services/activity/spotify/${this.selAccountId}`);
            if (activity?.activity) return;
            this.activity = activity;
        },
        async loadPlaylists() {
            this.playlists = await this.fetch(`/songs/playlists/${this.selAccountId}`);
            console.log(this.playlists);
        },
        selectAccount(id) {
            this.selAccountId = id;
            this.loadActivity();
            this.load('tracks');
            this.load('artists');
            this.loadHistory();
            this.loadPlaylists();
        }
    },
    async mounted() {
        this.loadAccounts();
    }
}
</script>

<style lang="scss" scoped>

.page.songs .block {
    margin: 16px auto;
    max-width: 1200px;

    .bar {
        display: flex;
        align-items: center;

        .field-select {
            margin: 0 12px 0 0;
            min-width: 256px;

            div {
                padding: 1px 24px !important;
            }
        }

        .play {
            display: flex;
            align-items: center;
            
            img {
                margin: 0 12px 0 0;
                width: 32px;
                height: 32px;
                border-radius: 5px;
                object-fit: cover;
                object-position: 50% 50%;
            }

            .name {
                color: var(--color-2);
                font-size: 14px;
            }
        }
    }

    .subtitle {
        margin: 12px 8px;
        color: var(--color-3);
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        user-select: none;

        &.click {
            cursor: pointer;
            margin: 4px 12px;
            color: var(--color-2);
            font-size: 12px;

            &:hover { text-decoration: underline; }
        }
    }

    .group {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 12px;

        .list {
            grid-template-columns: 1fr;
        }
    }

    .list {
        display: grid;
        align-items: flex-start;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 12px;

        &.playlists {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
    }

    @media (max-width: 1100px) {
        max-width: 90%;

        .group {
            grid-template-columns: 1fr;

            .list {
                grid-template-columns: 1fr 1fr;
            }
        }

        .list.playlists {
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        }
    }

    @media (max-width: 760px) {
        max-width: 90%;

        .group {
            grid-template-columns: 1fr;

            .list {
                grid-template-columns: 1fr 1fr;
            }
        }

        .list.playlists {
            grid-template-columns: 1fr 1fr 1fr;
        }
    }

    @media (max-width: 540px) {
        max-width: 95%;

        .bar {
            display: block;

            .play {
                margin: 8px 0 0 0;
                padding: 0 12px;
                box-sizing: border-box;
            }
        }

        .group {
            grid-template-columns: 1fr;

            .list {
                grid-template-columns: 1fr;
            }
        }

        .list {
            grid-template-columns: 1fr;

            &.playlists {
                grid-template-columns: 1fr 1fr;
            }
        }

        .subtitle.click {
            margin: 8px 0;
            text-align: center;
        }
    }

    @media (max-width: 320px) {

        .group {
            grid-template-columns: 1fr;
        }

        .list.playlists {
            grid-template-columns: 1fr;
        }
    }
}

</style>