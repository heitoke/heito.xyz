<template>
    <li class="song-artist-card" @click="redirect(data?.external_urls?.spotify)">
        <div class="image" :style="{ 'background-image': `url('${data?.images[0].url}')` }">
            <div class="followers">
                {{ data?.followers?.total }}
            </div>
        </div>
        <div class="header">
            <div class="name">{{ data?.name }}</div>
            <div class="genres">{{ data?.genres?.join(', ') }}</div>
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

.song-artist-card {
    cursor: pointer;
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

        .header {
            .name {
                text-decoration: underline;
            }
        }
    }

    .image {
        display: flex;
        margin: 0 12px 0 0;
        min-width: 64px;
        min-height: 64px;
        border-radius: 5px;
        align-items: flex-end;
        justify-content: center;
        background-size: cover;
        background-position: 50% 50%;

        &:hover {
            .followers {
                opacity: 0;
            }
        }

        .followers {
            padding: 2px 6px;
            font-size: 10px;
            border-radius: 15px;
            background: var(--C4);
            transform: translateY(50%);
            transition: .2s;
        }
    }

    .header {
        width: 100%;

        .name {
            cursor: pointer;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .genres {
            display: -webkit-box;
            color: var(--color-2);
            font-size: 12px;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    }
}

</style>