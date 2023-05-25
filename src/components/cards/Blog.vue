<template>
    <div class="blog">
        <div class="image" :style="{
            '--image': `url('${blog?.image}')`
        }">
            <div class="date">03.10.23</div>
        </div>
        <header>
            <div style="max-width: calc(100% - 32px);">
                <div class="title">{{ blog?.title }}</div>
                <div class="description">{{ blog?.description }}</div>
            </div>
            <div class="author" :style="{ '--avatar': `url('${getAvatar()}')` }"></div>
        </header>
    </div>
</template>

<script setup lang="ts">

import { getAvatar } from '../../libs/utils';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

export interface IBlog {
    title: string;
    description?: string;
    image?: string;
    createdAt: number;
}

export default defineComponent({
    name: 'CardBlog',
    computed: {},
    props: {
        blog: {
            type: Object as PropType<IBlog>
        }
    },
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

.blog {
    cursor: pointer;
    width: 100%;
    border: 1px solid var(--background-secondary);
    border-radius: 5px;
    box-sizing: border-box;
    overflow: hidden;

    .image {
        height: 169px;
        position: relative;
        transition: .2s;
        overflow: hidden;
        
        &::after {
            content: " ";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-size: cover;
            background-position: center;
            background-image: var(--image);
            filter: blur(5px);
            transform: scale(1.2);
            transition: .2s;
            z-index: -1;
        }

        .date {
            padding: 4px 8px;
            position: absolute;
            right: 4px;
            bottom: 4px;
            font-size: 12px;
            border-radius: 5px;
            backdrop-filter: blur(5px);
            transition: .2s;
            opacity: 0;
        }
    }

    &:hover {
        .image {
            &::after {
                transform: scale(1);
                filter: blur(0);
            }

            .date {
                opacity: 1;
            }
        }
    }

    header {
        display: flex;
        max-width: 100%;
        padding: 12px;
        border-top: 1px solid var(--background-secondary);
        align-items: center;
        justify-content: space-between;

        .title,
        .description {
            max-width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .title {
            font-weight: 600;
        }

        .description {
            margin: 2px 0 0 0;
            color: var(--text-secondary);
            font-size: 12px;
        }
    
        .author {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            background-image: var(--avatar);
        }
    }
}

</style>