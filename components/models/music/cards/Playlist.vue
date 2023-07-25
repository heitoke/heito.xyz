<template>
    <div class="playlist">
        <Image class="image" :src="playlist?.image || ''"/>

        <div>
            <Text class="name" :text="playlist?.name"/>

            <Text class="text" :text="playlist?.description" v-if="playlist?.description"/>
            <Text class="text" :text="`Tracks: ` + playlist?.totalTracks" v-show="playlist?.totalTracks! > 0"/>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IPlaylist, IPlaylistPlus } from '~/types/api/music';

const props = defineProps({
    playlist: { type: Object as PropType<IPlaylist> }
});

const type = ref<boolean>(false);


watch(() => props.playlist?.image, newValue => {
    show(newValue);
});


function show(playlistImage: string = '') {
    const image = new Image();

    image.src = playlistImage;

    image.onload = () => {
        type.value = true;
    }
}


onMounted(() => {
    show(props.playlist?.image);
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
        overflow: hidden;
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