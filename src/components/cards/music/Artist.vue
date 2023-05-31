<template>
    <div class="artist">
        <div class="image" :style="{ '--image': `url('${artist?.image}')` }"></div>

        <Text class="name" :text="artist?.name + ` (${artist?.popularity})`"/>

        <ul class="genres">
            <li v-for="genre of artist?.genres" :key="genre">{{ genre }}</li>
        </ul>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { IArtist } from '../../../libs/api/routes/music';

export default defineComponent({
    name: 'CardMusicArtist',
    computed: {},
    props: {
        artist: {
            type: Object as PropType<IArtist>
        }
    },
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

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
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        background-image: var(--image);
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