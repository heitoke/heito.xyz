<template>
    <div class="blogs">
        <header v-if="blogs?.length > 0">
            <div style="width: calc(50% - 8px); margin: 0 16px 0 0;">
                <div class="title">Popular blogs</div>

                <Alert :type="'mini'">
                    <div>Currently not available o_^</div>
                </Alert>

                <!-- <CarouselTab :gap="12" :column="getWinWidth > 640 ? 2 : 1">
                    <Blog v-for="blog of blogs" :key="blog?._id" :blog="blog"
                        @click="$router.push(`/blogs/${blog._id}`)"
                    />
                </CarouselTab> -->
            </div>

            <div style="width: calc(50% - 8px);">
                <div class="title">Latest blogs</div>

                <Alert :type="'mini'">
                    <div>Currently not available :O</div>
                </Alert>

                <!-- <CarouselTab :gap="12">
                    <Blog v-for="blog of blogs" :key="blog?._id" :blog="blog"
                        @click="$router.push(`/blogs/${blog._id}`)"
                    />
                </CarouselTab> -->
            </div>
        </header>

        <div class="title" style="margin: 64px 0 16px 0;">All blogs</div>
        <div class="list">
            <div class="filters">
                <Textbox label="Search blog" style="z-index: 1;"
                    @input="filters.text = $event.target.value"
                />
                
                <div class="line"></div>

                <NavBar :orientation="$win.size.width > 640 ? 'vertical' : 'horizontal'" v-if="blogs.length > 0" :menu="[
                    {
                        label: 'All',
                        icon: 'logo',
                        value: 'all'
                    },
                    ...(categories || []).map(c => ({
                        label: c[0].toLocaleUpperCase() + c.slice(1),
                        icon: listCategories.find(ct => ct.value === c)?.icon || 'pacman',
                        value: c
                    }))
                ]" @select="filters.category = $event.value as string"/>

                <Button :color="'var(--green)'" v-if="isAdmin"
                    @click="createNewBlog"
                >Create new blog</Button>
            </div>

            <ul v-if="!loading && blogs.length > 0">
                <TransitionGroup name="show-blog">
                    <Blog v-for="blog of getListBlogs" :key="blog?._id" :blog="blog"
                        @click="$router.push(`/blogs/${blog._id}`)"
                    />
                </TransitionGroup>
            </ul>

            <Loading style="width: 100%;" v-else-if="loading"/>

            <Alert style="width: 100%;" v-if="!loading && blogs.length < 1"/>
        </div>
    </div>
</template>

<script lang="ts" setup>

// import CarouselTab from '~/components/content/CarouselTab.vue';
import Blog from '~/components/models/blogs/Card.vue';

import NavBar from '~/components/content/NavBar.vue';

import { EPermissions } from '~/types/api/user';
import { type IBlog, categories as listCategories } from '~/types/api/blog';

import type { IMessage } from '~/windows/Message.vue';

const { $api, $win } = useNuxtApp();

const
    user = useUserStore(),
    windows = useWindowsStore(),
    notifications = useNotificationsStore();

const props = defineProps({});

const
    filters = ref({ text: '', category: 'void' }),
    loading = ref<boolean>(true),
    categories = ref<Array<string>>([]),
    blogs = ref<Array<IBlog>>([]);


const isAdmin = computed(() => {
    return user.getPer(EPermissions.Blogs);
});

const getListBlogs = computed(() => {
    const
        { category, text } = filters.value,
        regexText = new RegExp(text.trim(), 'i');

    return [...blogs.value]
        .filter(b => category === 'all' ? b : b.category === category)
        .filter(b => regexText.test(b.title) || regexText.test(b.description));
});


async function loadBlogs() {
    loading.value = true;

    const [listBlogs, status] = await $api.blogs.list();

    loading.value = false;

    if (status !== 200) return

    blogs.value = listBlogs;

    for (let blog of listBlogs) {
        if (!categories.value.includes(blog.category)) {
            categories.value = [...categories.value, blog.category];
        }
    }
}

function createNewBlog() {
    let name = '',
        title = '';

    const { windowId } = windows.create({
        component: 'Message',
        data: {
            title: 'Create new blog',
            icon: 'quill',
            components: [
                {
                    name: 'name',
                    component: 'Textbox',
                    props: { label: 'Name' },
                    events: {
                        input(e: InputEvent) {
                            name = (e.target as any).value;
                        }
                    }
                },
                {
                    name: 'title',
                    component: 'Textbox',
                    props: { label: 'Title' },
                    events: {
                        input(e: InputEvent) {
                            title = (e.target as any).value;
                        }
                    }
                }
            ],
            buttons: [
                {
                    label: 'Confirm',
                    click: async () => {
                        if (!name || !title) return;

                        const [result, status] = await $api.blogs.create({ name, title });

                        if (status !== 200) return;

                        windows.close(windowId);

                        loadBlogs();
                    }
                }
            ]
        } as IMessage
    });
}


useSeoMeta({
    title: 'Blogs'
});


onMounted(() => {
    loadBlogs();
});

</script>

<style lang="scss" scoped>

.show-blog {
    &-enter, &-leave {
        &-active {
            transform: scale(.9);
            transition: .2s;
            opacity: 0;
        }
    }
}

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
        transition: .2s;
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
            width: 100%;
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

    @media (max-width: 840px) {
        header {
            display: block;

            div {
                width: 100% !important;
            }
        }

        .list {
            .filters {
                .nav-bar {
                    margin: 0 0 12px 0;
                }
            }
        }
    }
}

</style>