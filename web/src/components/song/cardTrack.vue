<template>
    <li class="song-track-card">
        <img :src="data?.album?.images[0].url">
        <div class="header">
            <div class="name" @click="redirect(data?.external_urls?.spotify)">{{ data?.name }}</div>
            <ul class="artists">
                <li v-for="artist of data?.artists" :key="artist" @click="redirect(artist?.external_urls?.spotify)">{{ artist.name }}</li>
            </ul>
            <slot></slot>
        </div>
    </li>
</template>

<script>

export default {
    name: 'SongTrackCard',
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

.song-track-card {
    display: flex;
    padding: 12px;
    border-radius: 5px;
    border: 1px solid var(--dimming);
    align-items: center;
    transition: .2s;
    overflow: hidden;

    &:hover {
        box-shadow: 0 0 5px 2px var(--bg-2);
        border: 1px solid var(--bg-2);
    }

    img {
        margin: 0 12px 0 0;
        width: 64px;
        min-height: 64px;
        border-radius: 5px;
        object-fit: cover;
        object-position: 50% 50%;
    }

    .header {
        width: 100%;

        .name {
            cursor: pointer;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;

            &:hover {
                text-decoration: underline;
            }
        }

        .artists {
            display: flex;
            color: var(--color-2);
            font-size: 12px;
            flex-wrap: wrap;
            gap: 4px;

            li {
                &:not(:last-child):after {
                    content: ', ';
                }

                &:hover {
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }

        .date {
            color: var(--color-3);
            font-size: 12px;
        }
    }
}

</style>