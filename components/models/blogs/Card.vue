<template>
    <div class="blog">
        <Image class="image" :src="blog?.image || getAvatar({ nameId: blog?._id, type: 'marble', size: 1 })">
            <div class="likes blur" v-show="blog?.likes! > 0 || blog?.dislikes! > 0">
                <Icon name="like" style="color: var(--green);"/>
                <span>{{ blog?.likes }}</span>

                <Icon name="dislike" style="color: var(--red);"/>
                <span style="margin: 0;">{{ blog?.dislikes }}</span>
            </div>

            <div class="date blur">{{ time.timeago(blog?.createdAt) }}</div>
        </Image>

        <header>
            <div style="max-width: calc(100% - 32px);">
                <div class="title">{{ blog?.title }}</div>
                <div class="description">{{ blog?.description }}</div>
            </div>

            <Image class="author" :src="blog?.author?.avatar || getAvatar({ nameId: blog?.author?._id })"
                @mouseenter="toolpics.set({ text: blog?.author?.nickname || blog?.author?.username || blog?.author?._id })"
                @click.prevent.stop="windows.create({ component: 'UserProfile', data: blog?.author?._id })"
            />
        </header>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IBlog } from '~/types/api/blog';

const
    toolpics = useToolpicsStore(),
    windows = useWindowsStore();

const props = defineProps({
    blog: { type: Object as PropType<IBlog> }
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
        width: 100%;
        height: 169px;
        background-size: 120% auto;
        overflow: hidden;

        .likes, .date {
            padding: 4px 8px;
            position: absolute;
            font-size: 12px;
            border-radius: 5px;
            transition: .2s;
            opacity: 0;
        }

        .likes {
            display: flex;
            left: 4px;
            bottom: 4px;
            align-items: center;
            
            span, i {
                margin: 0 4px 0 0;
                font-size: 12px;
            }
        }

        .date {
            right: 4px;
            bottom: 4px;
        }
    }

    &:hover {
        .image {
            background-size: 100% auto;

            .date, .likes {
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
            min-width: 24px;
            height: 24px;
            border-radius: 50%;
        }
    }
}

</style>