<template>
    <li class="song-playlist-card" @click="redirect(data?.external_urls?.spotify)">
        <img :src="data.images[0].url">
        <div class="header">
            <div class="name">{{ data.name }}</div>
            <div class="description">{{ data.description }}</div>
            <div class="info">Tracks <span>{{ data.tracks.total }}</span></div>
            <div class="info">Author <span>{{ data.owner.display_name }}</span></div>
        </div>
    </li>
</template>

<script>

export default {
    name: 'SongPlaylistCard',
    components: {},
    computed: {},
    props: {
        data: { type: Object }
    },
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss">

.song-playlist-card {
    cursor: pointer;
    padding: 12px;
    position: relative;
    border-radius: 5px;
    border: 1px solid var(--T);
    background: var(--dimming);
    transition: .2s;
    overflow: hidden;

    &:hover {
        box-shadow: 0 0 5px 2px var(--bg-2);
        border: 1px solid var(--bg-2);
    }

    img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
        object-fit: cover;
        object-position: 50% 50%;
    }

    .header {
        margin: 4px 0 0 0;

        .name {
            font-size: 14px;
            font-weight: 700;
        }

        .description {
            display: -webkit-box;
            color: var(--color-2);
            font-size: 12px;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .info {
            color: var(--color-3);
            font-size: 12px;

            span { color: var(--color-2); }
        }
    }
}

</style>