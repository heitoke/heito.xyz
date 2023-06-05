<template>
    <div class="playlist">
        <Skeleton :show="type" class="image">
            <Transition name="image">
                <div class="image" :style="{ '--image': `url('${playlist?.image}')` }"></div>
            </Transition>
        </Skeleton>

        <div>
            <Text class="name" :text="playlist?.name"/>

            <Text class="text" :text="playlist?.description" v-if="playlist?.description"/>
            <Text class="text" :text="`Tracks: ` + playlist?.totalTracks" v-show="playlist?.totalTracks! > 0"/>
        </div>
    </div>
</template>

<script setup lang="ts">

import { getAvatar } from '../../../libs/utils';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { IPlaylist } from '../../../libs/api/routes/music';

export default defineComponent({
    name: 'CardMusicPlaylist',
    computed: {},
    props: {
        playlist: {
            type: Object as PropType<IPlaylist>
        }
    },
    data: () => ({
        type: false
    }),
    watch: {
        'track.image'(newValue) {
            this.show(newValue);
        }
    },
    methods: {
        show(playlistImage: string = '') {
            const image = new Image();

            image.src = playlistImage;

            image.onload = () => {
                this.type = true;
            }
        }
    },
    mounted() {
        this.show(this.playlist?.image)
    }
});

</script>

<style lang="scss" scoped>

.playlist {
    padding: 12px;
    width: 100%;
    box-sizing: border-box;

    &:hover {
        .image {
            transform: scale(.95);
        }

        .name {
            text-decoration: underline;
        }
    }

    .image {
        padding: 0 0 100% 0;
        width: 100%;
        height: 0;
        min-height: 0;
        border-radius: 10px;
        transition: .2s;

        &:not(.ui-skeleton) {
            background-size: cover;
            background-position: center;
            background-image: var(--image);
        }
    }

    .image + div {
        padding: 8px;
        box-sizing: border-box;
    }

    .name {
        max-width: 100%;
        font-size: 16px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .text {
        margin: 2px 0 0 0;
        color: var(--text-secondary);
        font-size: 13px;
    }
}

</style>