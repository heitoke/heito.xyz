<template>
    <div class="track">
        <Skeleton :show="type" class="image">
            <Transition name="image">
                <div class="image" :style="{ '--image': `url('${track?.image}')` }"></div>
            </Transition>
        </Skeleton>

        <div>
            <Text class="name" :text="track?.name"/>
            
            <ul class="artists">
                <li v-for="artist of track?.artists" :key="artist.id">
                    {{ artist.name }}
                </li>
            </ul>

            <Text class="duration" :text="getText" v-if="(track as IRecentlyTrack)?.playedAt || track?.duration"/>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IRecentlyTrack, ITrack } from '~/types/api/music';


const props = defineProps({
    track: { type: Object as PropType<ITrack | IRecentlyTrack> }
});


const type = ref<boolean>(false);


const getText = computed(() => {
    const
        track = props.track as IRecentlyTrack,
        duration = msInMin(track?.duration);
    
    return track?.playedAt ? `${time.format(track?.playedAt, 'dd MMM YY in hh:mm:ss')} (${duration})` : duration;
});


function msInMin(ms: number) {
    let min = Math.floor((ms / 1000 / 60) << 0),
    sec = Math.floor((ms / 1000) % 60);
    return `${min}:${`${sec}`.length < 2 ? `0${sec}` : sec}`;
}

function show(trackImage: string = '') {
    const image = new Image();

    image.src = trackImage;

    image.onload = () => {
        type.value = true;
    }
}


onMounted(() => {
    show(props.track?.image);
});

</script>

<style lang="scss" scoped>

.track {
    display: flex;
    padding: 12px;
    width: 100%;
    align-items: center;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    box-sizing: border-box;
    transition: .2s;

    &:hover {
        border-color: var(--main-color);
        box-shadow: 0 0 0 3px var(--main-color-alt);

        .image {
            transform: scale(1.1);
        }
    }

    &:active {
        .image {
            transform: scale(.95);
        }
    }

    .image {
        margin: 0 12px 0 0;
        min-width: 48px;
        height: 48px;
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
        max-width: calc(100% - 64px);

        .name {
            max-width: 100%;
            font-weight: 600;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        ul.artists {
            display: flex;
            align-items: center;
            overflow: hidden;

            li {
                color: var(--text-secondary);
                font-size: 12px;
                white-space: nowrap;

                &:hover {
                    cursor: pointer;
                    text-decoration: underline;
                }

                &::after {
                    content: ", ";
                    margin: 0 4px 0 0;
                }

                &:last-child {
                    &::after {
                        display: none;
                    }
                }
            }
        }

        .duration {
            color: var(--text-secondary);
            font-size: 12px;
        }
    }

}

</style>