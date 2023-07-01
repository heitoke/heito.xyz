<template>
    <div class="blog">
        <header :class="{ active: headerActive }"
            :style="{ '--header-content-height': `${($refs.headerContent as Element)?.clientHeight}px` }"
        >
            <div class="image" :style="{ '--image': `url('${blog?.image || getAvatar({ nameId: blog?._id, type: 'marble' })}')` }"></div>

            <div ref="headerContent">
                <div class="date">{{ time.timeago(blog?.createdAt) }}</div>
                <div class="title">{{ blog.title }}</div>
                
                <Transition name="height">
                    <div class="scroll" v-show="!headerActive" @click="scrollProps?.toScroll(0, getWinHeight / 2)">Scroll down</div>
                </Transition>

                <Transition>
                    <div class="description" v-show="headerActive">{{ blog?.description || '' }}</div>
                </Transition>

                <ul class="buttons">
                    <li v-for="btn of getButtons" :key="btn.icon"
                        :class="btn.icon === 'ellipsis' ? 'blog-cm' : ''"
                        @mouseenter="setToolpic({ text: `${btn?.text || ''} ${btn.label}`, position: headerActive ? 'top' : 'left' })"
                        @click="btn?.click ? btn?.click() : null"
                    >
                        <Icon :name="btn.icon" :style="`color: ${btn?.color};`"/>
                    </li>
                </ul>
            </div>
        </header>
        
        <div>
            <div class="separator">Start</div>

            <Content :content="blog.content || []" :edit="edit"
                @update="changes['content'] = $event; "
            />

            <div class="separator">The End</div>

            <!-- <CarouselTab :gap="12" :column="4">
                <Blog v-for="(a, id) of new Array(25).fill(blog)" :key="id" :blog="a"
                    @click="$router.push(`/blogs/${id}`)"
                />
            </CarouselTab> -->
        </div>

    </div>
</template>

<script lang="ts" setup>

import { getAvatar, time, copy } from '../../../libs/utils';

import Content from '../components/Content.vue';

// import Blog from '../components/Card.vue';

// import CarouselTab from '../../../components/content/CarouselTab.vue';

</script>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import { mapGetters, mapActions } from 'vuex';

import type { IScrollBar } from '../../../components/content/ScrollBar.vue';

import Blogs, { IBlog, IBlogContent } from '../../../libs/api/routes/blogs';
import { EPermissions } from '../../../libs/api/routes/users';

import type { IContextMenu } from '../../../store/modules/contextMenu';
import { IMessage } from '../../../windows/Message.vue';

import { categories } from '../../../libs/types';

export default defineComponent({
    name: 'BlogPage',
    components: {},
    computed: {
        ...mapGetters(['getWinHeight', 'getUser']),
        headerActive(): boolean {
            return this.scrollProps?.scroll.top! > (this.getWinHeight / 3);
        },
        blog() {
            return { ...this.selfBlog, ...this.changes }
        },
        isAdmin() {
            return this.getUser?.permissions?.includes(EPermissions.Blogs);
        },
        getButtons() {
            return [
                {
                    label: 'Likes',
                    icon: 'like',
                    text: this.blog.likes,
                    color: this.selfBlog.isLiked ? 'var(--green)' : '',
                    click: async () => {
                        if (this.selfBlog.isLiked) return;

                        const [message, status] = await Blogs.action(this.blog._id, 'like');

                        if (status !== 200) return;

                        if (this.selfBlog.isDisliked) {
                            this.selfBlog.dislikes--;
                            this.selfBlog.isDisliked = false;
                        }

                        this.selfBlog.likes++;
                        this.selfBlog.isLiked = true;
                    }
                },
                {
                    label: 'Dislikes',
                    icon: 'dislike',
                    text: this.blog.dislikes,
                    color: this.selfBlog.isDisliked ? 'var(--red)' : '',
                    click: async () => {
                        if (this.selfBlog.isDisliked) return;

                        const [message, status] = await Blogs.action(this.blog._id, 'dislike');

                        if (status !== 200) return;

                        if (this.selfBlog.isLiked) {
                            this.selfBlog.likes--;
                            this.selfBlog.isLiked = false;
                        }

                        this.selfBlog.dislikes++;
                        this.selfBlog.isDisliked = true;
                    }
                },
                {
                    label: 'Back',
                    icon: 'arrow-left',
                    click: () => this.$router.back()
                },
                ...[this.isAdmin ? {
                    label: 'Edit mode',
                    icon: 'pencil',
                    click: () => this.edit = !this.edit
                } : {}],
                {
                    label: 'Options',
                    icon: 'ellipsis',
                    click: () => this.contextMenu()
                },
                ...(Object.keys(this.changes).length > 0 ? [
                    {
                        label: 'Clear',
                        icon: 'clock-alt',
                        click: () => {
                            this.changes = {} as IBlog;
                        }
                    },
                    {
                        label: 'Save',
                        icon: 'quill',
                        click: async () => {
                            const [blog, status] = await Blogs.update(this.selfBlog?._id, this.changes);

                            if (status !== 200) return;

                            this.selfBlog = this.blog;
                            this.changes = {} as IBlog;
                        }
                    }
                ] : [])
            ]
        }
    },
    props: {
        scrollProps: {
            type: Object as PropType<IScrollBar>
        }
    },
    data: () => ({
        selfBlog: {} as IBlog,
        changes: {} as IBlog,
        edit: false
    }),
    watch: {
        headerActive(newValue) {
            this.setHeaderOptions({ blur: { enable: newValue, value: '5px' } });
        }
    },
    methods: {
        ...mapActions(['setHeaderLoading', 'setHeaderOptions', 'setContextMenu', 'setToolpic']),
        async loadBlog(blogId: string) {
            const [blog, status] = await Blogs.get(blogId);

            if (status !== 200) return;

            this.selfBlog = blog;
        },
        blogSettings() {
            const text = (title: string, icon: string, label: string, callback: (text: string) => void, value: string = '', type: 'area' | 'text' = 'text') => {
                let t = '';

                const { windowId } = this.$windows.create({
                    component: 'Message',
                    data: {
                        title,
                        icon,
                        components: [
                            {
                                name: 'text',
                                component: 'Textbox',
                                props: { label, value, type },
                                events: {
                                    input(e: InputEvent) {
                                        t = (e.target as any).value;
                                    }
                                }
                            }
                        ],
                        buttons: [
                            {
                                label: 'Confirm',
                                click: () => {
                                    callback(t);   

                                    this.$windows.close(windowId);
                                }
                            }
                        ]
                    } as IMessage
                });
            }

            const changeImage = () => {
                text('Change image', 'image', 'Image (URL)', url => this.changes.image = url, this.blog.image);
            }

            return {
                label: 'Settings',
                icon: 'settings',
                children: {
                    name: 'blog:settings',
                    title: 'Settings',
                    buttons: [
                        {
                            label: 'Name',
                            icon: 'text-a',
                            click: () => {
                                text('Change name', 'text-a', 'Name', name => this.changes.name = name, this.blog.name);
                            }
                        },
                        { separator: true },
                        {
                            label: 'Title',
                            icon: 'text-size',
                            click: () => {
                                text('Change title', 'text-size', 'Title', title => this.changes.title = title, this.blog.title);
                            }
                        },
                        {
                            label: 'Description',
                            icon: 'text-align-left',
                            click: () => {
                                text('Change description', 'text-align-left', 'Description', description => this.changes.description = description, this.blog.description, 'area');
                            }
                        },
                        { separator: true },
                        {
                            label: 'Image',
                            icon: 'image',
                            children: this.blog.image ? {
                                name: `blog:settings:image`,
                                title: `Image`,
                                buttons: [
                                    {
                                        label: 'Change',
                                        icon: 'pencil',
                                        click: () => changeImage()
                                    },
                                    {
                                        label: 'Remove',
                                        icon: 'close',
                                        click: () => {
                                            this.changes.image = '';
                                        }
                                    }
                                ]
                            } : undefined,
                            click: this.blog.image ? null : () => changeImage()
                        },
                        { separator: true },
                        {
                            label: 'Admin',
                            icon: 'fire',
                            children: {
                                name: 'blog:settings:admin',
                                title: 'Admin',
                                buttons: [
                                    {
                                        label: 'Category',
                                        icon: 'id-card',
                                        click: () => {
                                            let c = '';

                                            const { windowId } = this.$windows.create({
                                                component: 'Message',
                                                data: {
                                                    title: 'Change category',
                                                    icon: 'id-card',
                                                    components: [
                                                        {
                                                            name: 'category',
                                                            component: 'Select',
                                                            props: {
                                                                label: 'Category',
                                                                menu: categories,
                                                                value: this.blog.category
                                                            },
                                                            events: {
                                                                select(e: any) {
                                                                    c = e.value;
                                                                }
                                                            }
                                                        }
                                                    ],
                                                    buttons: [
                                                        {
                                                            label: 'Confirm',
                                                            click: () => {
                                                                this.changes.category = c;

                                                                this.$windows.close(windowId);
                                                            }
                                                        }
                                                    ]
                                                } as IMessage
                                            })
                                        }
                                    },
                                    { separator: true },
                                    {
                                        label: 'Delete blog',
                                        icon: 'trash',
                                        click: () => {
                                            const { windowId } = this.$windows.create({
                                                component: 'Message',
                                                data: {
                                                    title: 'Delete blog',
                                                    icon: 'trash',
                                                    text: 'Really delete this blog?',
                                                    buttons: [
                                                        {
                                                            label: 'Confirm',
                                                            icon: 'pacman',
                                                            click: async () => {
                                                                const [result, status] = await Blogs.delete(this.blog._id);

                                                                if (status !== 200) return;

                                                                this.$router.push('/blogs');

                                                                this.$windows.close(windowId);
                                                            }
                                                        }
                                                    ]
                                                } as IMessage
                                            });
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                } as IContextMenu
            }
        },
        contextMenu() {
            this.setContextMenu({
                name: `blog:options`,
                position: ['top', this.headerActive ? 'right' : 'left', 'fixed-target'],
                event: (this.$el as Element).querySelector('.blog-cm')!,
                buttons: [
                    ...[this.isAdmin ? this.blogSettings() : {}],
                    { separator: true },
                    {
                        label: 'Copy Blog ID',
                        click: () => {
                            copy(this.blog?._id);
                        }
                    }
                ]
            } as IContextMenu);
        }
    },
    mounted() {
        this.setHeaderOptions({ blur: { enable: false } });

        this.loadBlog(this.$route.params.blogId as string);
    },
    unmounted() {
        this.setHeaderOptions({ blur: { enable: true, value: '5px' } });
    }
});

</script>

<style lang="scss" scoped>

.header-enter-active {
    animation: Height .2s linear;
}

@keyframes Header {
    from {
        max-height: 0px;
        height: 0px;
        opacity: 0;
    }
}

.super.active {
    .page.blog {
        header {
            height: calc(100vh - 72px);
        }
    }
}

.page.blog {
    padding: 0 !important;
    position: relative;

    header {
        display: flex;
        margin: 0 0 calc(var(--header-content-height) - 96px) 0;
        padding: 5% 10%;
        width: 100%;
        height: 100vh;
        position: relative;
        align-items: flex-start;
        justify-content: flex-end;
        flex-direction: column;
        box-sizing: border-box;
        transition: .2s;

        & > div {
            width: 100%;
            transition: .2s;
        }

        &.active {
            // transform: translateY(64px);

            .image {
                border-radius: 15px;
                transform:  scale(.8);
                opacity: .5;

                &::after {
                    transform: scale(1.4);
                    filter: blur(5px);
                    // box-shadow: 0 -100px 100px 100px var(--background-primary) inset;
                }
            }

            & > div {
                // transform: translateY(calc(var(--header-content-height) - (var(--header-content-height) / 2)));
                transform: translateY(calc(var(--header-content-height) + 96px));
            }

            .date, .title, .scroll {
                color: var(--text-primary);
                mix-blend-mode: none;
            }

            ul.buttons {
                right: 0;
                left: 0;
                bottom: calc(100% + 32px);
                flex-direction: row;

                li {
                    margin: 0 8px 0 0;
                    opacity: 1;
                }
            }
        }
        
        .image {
            width: 100%;
            max-height: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            transition: .2s;
            overflow: hidden;
            z-index: -1;

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
                transition: .2s;
            }
        }

        .date, .title, .scroll {
            color: #fff;
            mix-blend-mode: difference;
        }

        .title {
            margin: 12px 0 16px 0;
            max-width: 60%;
            font-size: clamp(24px, calc(var(--font) - 6vmin), 96px);
        }

        .scroll {
            cursor: pointer;
            font-weight: 700;
            text-transform: uppercase;
        }

        .description {
            color: var(--text-secondary);
            font-size: 16px;
        }

        ul.buttons {
            display: flex;
            position: absolute;
            right: 10%;
            bottom: 10%;
            align-items: flex-end;
            flex-direction: column;
            transition: all .2s;

            li {
                cursor: pointer;
                display: flex;
                margin: 0 0 8px 0;
                min-width: 24px;
                height: 24px;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
                border: 1px solid var(--background-secondary);
                transition: .2s;
                opacity: .1;

                &:hover {
                    opacity: 1;

                    i {
                        color: var(--main-primary);
                    }
                }

                &:last-child {
                    margin: 0;
                }

                i {
                    color: var(--text-secondary);
                    font-size: 12px;
                }
            }
        }
    }

    header + div {
        padding: 5% 10%;

        .separator {
            --t: #222222;
            display: flex;
            margin: 24px 0;
            color: var(--t);
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            white-space: nowrap;
            align-items: center;
            user-select: none;

            &::before {
                margin: 0 24px 0 0;
            }

            &::after {
                margin: 0 0 0 24px;
            }

            &::before, &::after {
                content: " ";
                width: 100%;
                border-top: 1px solid var(--t);
            }
        }

        h1, h2, h3, h4, h5, h6 {
            font-size: revert !important;
        }
        
        p {
            padding: 0 0 8px 0;
            font-size: 16px;
        }
    }

}

</style>