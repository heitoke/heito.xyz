<template>
    <div class="artist">
        <Skeleton :show="type" class="image">
            <Transition name="image">
                <div class="image" :style="{ '--image': `url('${artist?.image}')` }"></div>
            </Transition>
        </Skeleton>

        <Text class="name" :text="artist?.name + ` (${artist?.popularity})`"/>

        <ul class="genres">
            <li v-for="genre of artist?.genres" :key="genre">{{ genre }}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IArtist } from '~/types/api/music';

const props = defineProps({
    artist: { type: Object as PropType<IArtist> }
});

const type = ref<boolean>(false);


watch(() => props.artist?.image, newValue => {
    show(newValue);
});


function show(artistImage: string = '') {
    const image = new Image();

    image.src = artistImage;

    image.onload = () => {
        type.value = true;
    }
}


onMounted(() => {
    show(props.artist?.image);
});

</script>

<style lang="scss" scoped>

.image-enter-active,
.image-leave-active {
    transition: all 1s;
    opacity: 0;
}

.artist {
    display: flex;
    padding: 12px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    .image {
        padding: 0 0 calc(100% - 48px) 0;
        width: calc(100% - 48px);
        min-height: 0;
        border-radius: 50%;
        transition: 1s;

        &:not(.ui-skeleton) {
            background-size: cover;
            background-position: center;
            background-image: var(--image);
        }
    }

    .name {
        margin: 12px 0 0 0;
        max-width: 100%;
        font-size: 16px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    ul.genres {
        display: flex;
        margin: 8px 0 0 0;
        flex-wrap: wrap;
        justify-content: center;
        
        li {
            color: var(--text-secondary);
            font-size: 12px;
            text-align: center;

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
}

</style>