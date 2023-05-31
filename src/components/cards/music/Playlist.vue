<template>
    <div class="playlist">
        <div class="image" :style="{ '--image': `url('${playlist?.image}')` }"></div>

        <div>
            <Text class="name" :text="playlist?.name"/>

            <Text class="text" :text="playlist?.description" v-if="playlist?.description"/>
            <Text class="text" :text="`Tracks: ` + playlist?.totalTracks"/>
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
    methods: {},
    mounted() {}
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
        border-radius: 10px;
        background-size: cover;
        background-position: center;
        background-image: var(--image);
        transition: .2s;
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