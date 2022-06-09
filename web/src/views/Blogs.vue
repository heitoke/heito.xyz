<template>
    <div class="blogs">
        <div class="block">
            <div class="subtitle" v-if="list.length > 0">Last blogs</div>
            <ul class="list last" v-if="list.length > 0">
                <BlogPage v-for="blog of list.sort((a, b) => b.createAt - a.createAt).slice(0, 3)" :key="blog" :data="blog"
                    @click="router(`/blogs/${blog?.id}`)"    
                />
            </ul>
            <div class="subtitle">All blogs</div>
            <div class="filter">
                <Button text="Add new project" color="green" @click="add()" v-if="getRole"/>
                <Text text="Search blogs" @onEvent="text = $event"/>
            </div>
            <transition-group tag="ul" class="list all" enter-active-class="blog-show" leave-active-class="blog-hide">
                <BlogPage v-for="blog of list.sort((a, b) => b.title - a.title).filter(item => new RegExp(text, 'i').test(item.title))" :key="blog" :data="blog" type="line"
                    @click="router(`/blogs/${blog?.id}`)"    
                />
            </transition-group>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>

import { defineAsyncComponent } from 'vue';

export default {
    name: 'BlogsPage',
    components: {
        BlogPage: defineAsyncComponent(() => import('../components/blog/card.vue'))
    },
    computed: {},
    data() {
        return {
            text: '',
            list: []
        }
    },
    methods: {
        async load() {
            this.list = await this.fetch(`/blogs?token=${this.getLocal?.token}`);
        },
        async add() {
            let { status } = await this.fetch('/blogs/add', { token: this.getLocal?.token, data: { title: 'New Blog' } });
            if (status !== 200) return;
            this.load();
        }
    },
    mounted() {
        this.load();
    }
}
</script>

<style lang="scss" scoped>

.blog-show, .blog-hide {
    transform: scale(.9);
    transition: all .2s;
    opacity: 0;
}

.page.blogs .block {
    margin: 16px auto 0 auto;
    max-width: 940px;

    .subtitle {
        margin: 12px 0;
        color: var(--color-3);
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
    }

    .filter {
        display: flex;
        margin: 0 0 12px 0;
        align-items: center;

        .field-button {
            margin: 0 12px 0 0;
            font-size: 12px;
            white-space: nowrap;
        }
    }

    .list {
        display: grid;
        max-width: 100%;
        align-items: flex-start;
        gap: 12px;

        &.last {
            grid-template-columns: 1fr 1fr 1fr;
        }

        &.all {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 760px) {
        max-width: 95%;
    }

    @media (max-width: 540px) {
        max-width: 95%;

        .list {
            &.last {
                grid-template-columns: 1fr;
            }

            &.all {
                grid-template-columns: 1fr;
            }
        }
    }
}

</style>