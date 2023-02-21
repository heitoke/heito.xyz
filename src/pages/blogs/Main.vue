<template>
    <div class="blogs">
        <div class="title">Popular blogs</div>
        <CarouselTab :gap="0">
            <Blog v-for="(_, id) of new Array(5)" :key="id" :blog="blog" style="margin: 0 12px 0 0;"
                @click="$router.push(`/blogs/${id}`)"
            />
        </CarouselTab>
        <div class="title">Latest blogs</div>
        <CarouselTab :gap="0">
            <Blog v-for="(_, id) of new Array(5)" :key="id" :blog="blog" style="margin: 0 12px 0 0;"
                @click="$router.push(`/blogs/${id}`)"
            />
        </CarouselTab>
        <div class="title">All blogs</div>
        <ul class="list">
            <Blog v-for="(_, id) of new Array(5)" :key="id" :blog="blog" style="margin: 0 12px 0 0;"
                @click="$router.push(`/blogs/${id}`)"
            />
        </ul>
    </div>
</template>

<script setup lang="ts">

import CarouselTab from '../../components/content/CarouselTab.vue';
import Blog from '../../components/cards/Blog.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'BlogsPage',
    components: {},
    computed: {},
    props: {},
    data: () => ({
        blog: {
            title: 'Blog Blog Blog Blog Blog Blog Blog Blog Blog Blog Blog Blog',
            description: 'Description',
            image: 'https://avatars.mds.yandex.net/i?id=79ebacfe308fb494ac056a01cb3cba3840e07e0c-8350343-images-thumbs&n=13',
            createdAt: Date.now()
        }
    }),
    watch: {},
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

.page.blogs {
    padding: 5vw 5vh 64px 5vh;

    .title {
        margin: 0 0 12px 0;
        font-size: clamp(16px, var(--font), 32px);
    }

    .blog {
        flex-shrink: 0;
        scroll-snap-align: start;
    }

    .list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 12px;
        grid-row-gap: 12px;
    }
}

</style>