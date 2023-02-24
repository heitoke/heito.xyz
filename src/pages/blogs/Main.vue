<template>
    <div class="blogs">
        <header>
            <div style="width: calc(50% - 8px); margin: 0 16px 0 0;">
                <div class="title">Popular blogs</div>
                <CarouselTab :gap="12" :column="2">
                    <Blog v-for="(_, id) of new Array(5)" :key="id" :blog="blog"
                        @click="$router.push(`/blogs/${id}`)"
                    />
                </CarouselTab>
            </div>
            <div style="width: calc(50% - 8px);">
                <div class="title">Latest blogs</div>
                <CarouselTab :gap="12">
                    <Blog v-for="(_, id) of new Array(5)" :key="id" :blog="blog"
                        @click="$router.push(`/blogs/${id}`)"
                    />
                </CarouselTab>
            </div>
        </header>
        <div class="title" style="margin: 64px 0 16px 0;">All blogs</div>
        
        <div class="list">
            <div class="filters">
                <Textbox/>
                
                <div class="line"></div>

                <Menu :menu="{
                    name: 'blogs:filters',
                    buttons: [
                        {
                            label: 'Test'
                        }
                    ]
                }"/>
            </div>
            <TransitionGroup tag="ul">
                <Blog v-for="(_, id) of new Array(5)" :key="id" :blog="blog" style="margin: 0 12px 0 0;"
                    @click="$router.push(`/blogs/${id}`)"
                />
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup lang="ts">

import CarouselTab from '../../components/content/CarouselTab.vue';
import Blog from '../../components/cards/Blog.vue';

import Menu from '../../components/content/Menu.vue';

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
    methods: {
        log() {
            console.log(123);
            
        }
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.page.blogs {
    padding: 5vw 10vw 64px 10vw;

    header {
        display: flex;
    }

    .title {
        margin: 0 0 12px 0;
        font-size: clamp(16px, var(--font), 32px);
    }

    .blog {
        flex-shrink: 0;
        scroll-snap-align: start;
    }

    .list {
        display: flex;

        @media (max-width: 640px) {
            display: block;

            .filters {
                margin: 0 0 24px 0 !important;
            }
        }

        .filters {
            margin: 0 16px 0 0;
            min-width: 276px;

            .line {
                margin: 12px auto;
                // padding: 0 24px;
                width: calc(100% - 24px);
                border-top: 1px solid var(--background-secondary);
                box-sizing: border-box;
            }
        }

        ul {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-column-gap: 12px;
            grid-row-gap: 12px;

            @media (max-width: 1540px) {
                grid-template-columns: repeat(2, 1fr);
            }

            @media (max-width: 1080px) {
                grid-template-columns: 1fr;
            }
        }
    }
}

</style>