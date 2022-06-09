<template>
    <div class="blog" v-if="blog">
        <div class="block" @contextmenu="openContextMenu([$event, 'blog:edit'])">
            <div class="image" :style="{ 'background-image': blog?.image ? `url('${blog?.image}')` : '', height: blog?.image ? '40vh' : '24px' }">
                <div class="info">
                    <i class="uil uil-clock"></i>
                    {{ timeago(blog?.createAt) }}
                </div>
            </div>
            <main>
                <div class="header">
                    <div class="title">{{ blog?.title }}</div>
                    <div :class="['description', { mini: descHide }]">{{ blog?.description }}</div>
                    <div class="btn-desc" v-if="blog?.description" @click="descHide = !descHide">{{ descHide ? 'Expand' : 'Roll up' }}</div>
                    <Button text="Save" v-if="oldBlog !== JSON.stringify(blog)" @click="save()"/>
                </div>
                <div class="subtitle" v-if="blog?.links?.length > 0">Links</div>
                <ul class="links">
                    <li v-for="(link, idx) of blog?.links" :key="(link, idx)"
                        @contextmenu="openContextMenu([$event, `blog:link:edit:${idx}`])"
                        @click="redirect(link.url)"
                    >
                        <icon :data="link?.icon"/>
                        <span>{{ link?.label }}</span>

                        <ContextMenu :name="`blog:link:edit:${idx}`" v-if="getRole">
                            <ul>
                                <li>
                                    <i class="uil uil-pen" style="color: var(--C7);"></i>
                                    <span>Edit link</span>
                                </li>
                                <div class="line"></div>
                                <li @click="blog['links'] = blog?.links?.filter((_, i) => i !== idx)">
                                    <i class="uil uil-times" style="color: var(--C5);"></i>
                                    <span>Remove link</span>
                                </li>
                            </ul>
                        </ContextMenu>
                    </li>
                </ul>
                <div class="content" @contextmenu="openContextMenu([$event, 'blog:content:edit'])">
                    <textarea v-if="edited" v-model="blog['content']"></textarea>
                    <div class="markdown-content" v-else v-html="md(blog['content'] || '')"></div>
                </div>
            </main>
        </div>

        <!-- ContextMenu -->

        <ContextMenu name="blog:edit" v-if="getRole">
            <ul>
                <li @click="blog['public'] = !blog['public']">
                    <i class="uil uil-eye" style="color: var(--C3);"></i>
                    <span>{{ blog['public'] ? 'Private' : 'Public' }} mode</span>
                </li>
                <div class="line"></div>
                <li @click="setMenu(['SettingsEditMenu', { title: 'Edit image', value: blog?.image, save: val => blog['image'] = val }])">
                    <i class="uil uil-image" style="color: var(--C8);"></i>
                    <span>Edit image</span>
                </li>
                <li v-if="blog?.image" @click="blog['image'] = ''">
                    <i class="uil uil-image-times" style="color: var(--C5);"></i>
                    <span>Remove image</span>
                </li>
                <li @click="setMenu(['SettingsEditMenu', { title: 'Edit title', value: blog?.title, save: val => blog['title'] = val }])">
                    <i class="uil uil-text"></i>
                    <span>Edit title</span>
                </li>
                <li @click="setMenu(['SettingsEditMenu', { title: 'Edit description', value: blog?.description, save: val => blog['description'] = val }])">
                    <i class="uil uil-paragraph"></i>
                    <span>Edit description</span>
                </li>
                <div class="line"></div>
                <li @click="setMenu(['SettingsAddLinkMenu', { title: 'Add Link', save: val => blog['links'] = [ ...blog['links'] || [], val ] }])">
                    <i class="uil uil-link-add" style="color: var(--C2);"></i>
                    <span>Add link</span>
                </li>
                <div class="line"></div>
                <li @click="deleteBlog()">
                    <i class="uil uil-trash" style="color: var(--C5);"></i>
                    <span>Delete blog</span>
                </li>
            </ul>
        </ContextMenu>

        <ContextMenu name="blog:content:edit" v-if="getRole">
            <ul>
                <li @click="edited = !edited">
                    <i class="uil uil-text-fields"></i>
                    <span>{{ edited ? 'Preview' : 'Edit' }} text</span>
                </li>
            </ul>
        </ContextMenu>
    </div>
</template>

<script>

export default {
    name: 'BlogPage',
    components: {},
    computed: {},
    data() {
        return {
            descHide: true,
            edited: false,
            blog: null,
            oldBlog: null,
            ids: []
        }
    },
    methods: {
        async load(blogId) {
            let blog = await this.fetch(`/blogs/${blogId}?token=${this.getLocal?.token}`);
            console.log(blog);
            this.blog = blog;
            this.oldBlog = JSON.stringify(this.blog);
        },
        async save() {
            let { status } = await this.fetch(`/blogs/${this.blog.id}/update`, { token: this.getLocal?.token, data: { ...this.blog } });
            if (status === 200) this.oldBlog = JSON.stringify(this.blog);
        },
        async deleteBlog() {
            let { status } = await this.fetch(`/blogs/${this.blog.id}/remove?token=${this.getLocal?.token}`);
            if (status === 200) this.router('/blogs');
        }
    },
    mounted() {
        this.load(this.$route.params.blogId);
    }
}
</script>

<style lang="scss">

.page.blog .block {
    margin: 0 auto;

    .image {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        flex-direction: column;
        background-size: cover;
        background-position: 50% 50%;

        .info  {
            margin: 8px auto;
            min-width: 55%;
            font-size: 14px;

            i {
                color: var(--color-2);
            }
        }
    }

    main {
        margin: 0 auto;
        max-width: 60%;

        .subtitle {
            margin: 4px 0;
            color: var(--color-3);
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            user-select: none;
        }
        
        .header {
            margin: 32px 0;

            .title {
                font-size: 32px;
                font-weight: 700;
            }

            .description {
                display: -webkit-box;
                color: var(--color-2);
                font-size: 15px;
                word-break: break-all;
                overflow: hidden;

                &.mini {
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                }
            }

            .btn-desc {
                cursor: pointer;
                margin: 4px 0;
                color: var(--color-3);
                font-size: 12px;
                text-transform: uppercase;
                user-select: none;
            }
        }

        .links {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
            gap: 4px;

            li {
                cursor: pointer;
                padding: 8px 12px;
                font-size: 14px;
                transition: .2s;

                &:hover {
                    border-radius: 5px;
                    background: var(--dimming);

                    i { color: var(--C1); }
                }

                i {
                    margin: 0 8px 0 0;
                    color: var(--color-2);
                }
            }
        }

        .content {
            margin: 32px 0 0 0;
            padding: 16px 0 0 0;
            border-top: 1px dashed var(--dimming);

            textarea {
                padding: 12px;
                width: 100%;
                min-height: 512px;
                color: var(--color);
                font-size: 14px;
                border-radius: 5px;
                border: 1px solid var(--dimming);
                background: var(--bg);
                transition: .2s;
                box-sizing: border-box;
                resize: vertical;

                &:focus {
                    border: 1px solid var(--bg-2);
                }
            }

            .markdown-content {

                .link {
                    color: var(--color-2);
                    text-decoration: underline;
                    transition: .2s;

                    &:hover {
                        color: var(--C1);
                    }
                }

                .highlights {
                    padding: 2px 4px;
                    font-size: 14px;
                    border-radius: 5px;
                    background: var(--bg-2);
                }
            }
        }
    }

    @media (max-width: 540px) {
        .image {
            .info  {
                min-width: 85%;
            }
        }
        main {
            max-width: 90%;
        }
    }
}

</style>