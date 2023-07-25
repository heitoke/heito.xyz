<template>
    <div class="blog" ref="root">
        <header :class="{ active: isHeaderActive }"
            :style="{ '--header-content-height': `${($refs.headerContent as Element)?.clientHeight}px` }"
        >
            <Image class="image"
                :src="blog?.image || getAvatar({ nameId: blog?._id, type: 'marble' })"
            />

            <div ref="headerContent">
                <div class="date">{{ time.timeago(blog?.createdAt) }}</div>
                <div class="title">{{ blog.title }}</div>
                
                <Transition name="height">
                    <div class="scroll" v-show="!isHeaderActive" @click="scrollProps?.toScroll(0, $win.size.height / 2)">Scroll down</div>
                </Transition>

                <Transition>
                    <div class="description" v-show="isHeaderActive">{{ blog?.description || '' }}</div>
                </Transition>

                <ul class="buttons">
                    <li v-for="btn of getOptionsButtons" :key="btn.icon"
                        :class="btn.icon === 'ellipsis' ? 'blog-cm' : ''"
                        @mouseenter="toolpics.set({ text: `${btn?.text || ''} ${btn.label}`, position: isHeaderActive ? 'top' : 'left' })"
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

            <div class="separator end">The End</div>

            <!-- <CarouselTab :gap="12" :column="4">
                <Blog v-for="(a, id) of new Array(25).fill(blog)" :key="id" :blog="a"
                    @click="$router.push(`/blogs/${id}`)"
                />
            </CarouselTab> -->

            <NavBar :default-id="0" style="margin: 0 0 12px 0;"
                :menu="[
                    { label: 'Comments', icon: 'comments-alt', value: 'comments' },
                    { label: `Likes [${blog?.likes}]`, icon: 'like', value: 'likes' },
                    { label: `Dislikes [${blog?.dislikes}]`, icon: 'dislike', value: 'dislikes' }
                ]"
                @select="type = $event.value as Block"
            />

            <Alert v-if="type === 'comments'">
                <div style="font-size: 24px;">Our comments work in a completely different way.</div>

                <Button style="margin: 12px 0 0 0; max-width: max-content;"
                    @click="comments.setVisible(!comments.isVisible)"
                >
                    {{ comments.isVisible ? 'Hide' : 'Show' }} comments
                </Button>
            </Alert>

            <div v-if="type === 'likes' || type === 'dislikes'">
                <ul class="list" v-if="(type === 'likes' ? likes : dislikes).list.length > 0">
                    <User v-for="({ user, ratedAt }) of (type === 'likes' ? likes : dislikes).list" :key="user._id" :user="user"
                        :text="`Rated at ` + time.timeago(ratedAt)"
                    />
                </ul>
                
                <Alert v-else/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import Content from '~/components/models/blogs/Content.vue';

import NavBar from '~/components/content/NavBar.vue';

import User from '~/components/models/user/Card.vue';

import type { IScrollBar } from '~/components/content/ScrollBar.vue';

import { useHeaderStore } from '~/stores/header';

import { IBlog, TBlogUserLike, categories } from '~/types/api/blog';
import { EPermissions } from '~/types/api/user';

import type { IContextMenu, ItemButton } from '~/types/stores/contextMenu';
import type { IMessage } from '~/windows/Message.vue';

type Block = 'comments' | 'likes' | 'dislikes';

type ListLikes = {
    list: Array<TBlogUserLike>;
    lastedAt: number;
}

const { $api, $win, $router } = useNuxtApp();

const route = useRoute();

const
    user = useUserStore(),
    toolpics = useToolpicsStore(),
    windows = useWindowsStore(),
    notifications = useNotificationsStore(),
    contextMenu = useContextMenuStore(),
    header = useHeaderStore(),
    comments = usePageCommentsStore();

const root = ref<HTMLElement | null>(null);

const props = defineProps({
    scrollProps: { type: Object as PropType<IScrollBar> }
});

const
    type = ref<Block>('comments'),
    selfBlog = ref<IBlog>({} as IBlog),
    changes = ref<IBlog>({} as IBlog),
    likes = ref<ListLikes>({ list: [], lastedAt: 0 }),
    dislikes = ref<ListLikes>({ list: [], lastedAt: 0 }),
    edit = ref<boolean>(false);


const [_blog, status] = await $api.blogs.get(route.params.id as string);

if (status === 200) {
    selfBlog.value = _blog;

    useSeoMeta(seo.createTemplate({
        title: `${_blog?.title || _blog?.name || _blog?._id} | Blog`,
        description: _blog?.description || '',
        image: _blog?.image || getAvatar({ nameId: _blog?._id, type: 'marble' }),
        color: '#FFBF34'
    }));
}


const isHeaderActive = computed(() => {
    return props.scrollProps?.scroll.top! > ($win.size.width / 4);
});

const blog = computed<IBlog>(() => {
    return { ...selfBlog.value, ...changes.value };
});

const isAdmin = computed(() => {
    return user.getPer(EPermissions.Blogs);
});

const getOptionsButtons = computed(() => {
    return [
        {
            label: 'Likes',
            icon: 'like',
            text: blog.value.likes,
            color: selfBlog.value.isLiked ? 'var(--green)' : '',
            click: async () => {
                if (selfBlog.value.isLiked) return;

                const [message, status] = await $api.blogs.action(blog.value._id, 'like');

                if (status !== 200) return;

                if (selfBlog.value.isDisliked) {
                    selfBlog.value.dislikes--;
                    selfBlog.value.isDisliked = false;
                }

                selfBlog.value.likes++;
                selfBlog.value.isLiked = true;
            }
        },
        {
            label: 'Dislikes',
            icon: 'dislike',
            text: blog.value.dislikes,
            color: selfBlog.value.isDisliked ? 'var(--red)' : '',
            click: async () => {
                if (selfBlog.value.isDisliked) return;

                const [message, status] = await $api.blogs.action(blog.value._id, 'dislike');

                if (status !== 200) return;

                if (selfBlog.value.isLiked) {
                    selfBlog.value.likes--;
                    selfBlog.value.isLiked = false;
                }

                selfBlog.value.dislikes++;
                selfBlog.value.isDisliked = true;
            }
        },
        {
            label: 'Back',
            icon: 'arrow-left',
            click: () => $router.back()
        },
        ...(isAdmin.value ? [{
            label: 'Edit mode',
            icon: 'pencil',
            click: () => edit.value = !edit.value
        }] : []),
        {
            label: 'Options',
            icon: 'ellipsis',
            click: blogContextMenu
        },
        {
            label: 'To the end',
            icon: 'arrow-down',
            click: () => {
                const el = root.value?.querySelector('.separator.end')! as HTMLElement;

                props.scrollProps?.toScroll(0, el?.offsetTop);
            }
        },
        ...(Object.keys(changes.value).length > 0 ? [
            {
                label: 'Clear',
                icon: 'clock-alt',
                click: () => {
                    changes.value = {} as IBlog;
                }
            },
            {
                label: 'Save',
                icon: 'quill',
                click: async () => {
                    const [_, status] = await $api.blogs.update(selfBlog.value?._id, changes.value);

                    if (status !== 200) return;

                    selfBlog.value = blog.value;
                    changes.value = {} as IBlog;
                }
            }
        ] : [])
    ];
});


watch(isHeaderActive, (newValue: boolean) => {
    header.setOptions({ blur: { enable: newValue, value: '5px' } });
});

watch(type, (newValue) => {
    switch(newValue) {
        case 'likes':
        case 'dislikes':
            const _likes = (newValue === 'likes' ? likes : dislikes).value;

            if ((_likes.lastedAt + 30000) > Date.now()) return;

            loadLikes(newValue);
            break;
    }
});


async function loadLikes(type: 'likes' | 'dislikes') {
    const [list, status] = await $api.blogs.likes(selfBlog.value._id, type);

    if (status !== 200) return;

    (type === 'likes' ? likes : dislikes).value = {
        list,
        lastedAt: Date.now()
    }

    selfBlog.value[type] = list.length;
}

function blogSettings(): ItemButton {
    const text = (title: string, icon: string, label: string, callback: (text: string) => void, value: string = '', type: 'area' | 'text' = 'text') => {
        let t = '';

        const { windowId } = windows.create({
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

                            windows.close(windowId);
                        }
                    }
                ]
            } as IMessage
        });
    }

    const changeImage = () => {
        text('Change image', 'image', 'Image (URL)', url => changes.value.image = url, blog.value.image);
    }

    return {
        type: 'button',
        label: 'Settings',
        icon: 'settings',
        children: {
            name: 'blog:settings',
            title: 'Settings',
            items: [
                {
                    type: 'button',
                    label: 'Name',
                    icon: 'text-a',
                    click: () => {
                        text('Change name', 'text-a', 'Name', name => changes.value.name = name, blog.value.name);
                    }
                },
                { type: 'separator' },
                {
                    type: 'button',
                    label: 'Title',
                    icon: 'text-size',
                    click: () => {
                        text('Change title', 'text-size', 'Title', title => changes.value.title = title, blog.value.title);
                    }
                },
                {
                    type: 'button',
                    label: 'Description',
                    icon: 'text-align-left',
                    click: () => {
                        text('Change description', 'text-align-left', 'Description', description => changes.value.description = description, blog.value.description, 'area');
                    }
                },
                { type: 'separator' },
                {
                    type: 'button',
                    label: 'Image',
                    icon: 'image',
                    children: blog.value.image ? {
                        name: `blog:settings:image`,
                        title: `Image`,
                        items: [
                            {
                                type: 'button',
                                label: 'Change',
                                icon: 'pencil',
                                click: () => changeImage()
                            },
                            {
                                type: 'button',
                                label: 'Remove',
                                icon: 'close',
                                click: () => {
                                    changes.value.image = '';
                                }
                            }
                        ]
                    } : undefined,
                    click: blog.value.image ? null : () => changeImage()
                },
                { type: 'separator' },
                {
                    type: 'button',
                    label: 'Admin',
                    icon: 'fire',
                    children: {
                        name: 'blog:settings:admin',
                        title: 'Admin',
                        items: [
                            {
                                type: 'button',
                                label: 'Category',
                                icon: 'id-card',
                                click: () => {
                                    let c = '';

                                    const { windowId } = windows.create({
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
                                                        value: blog.value.category
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
                                                        changes.value.category = c;

                                                        windows.close(windowId);
                                                    }
                                                }
                                            ]
                                        } as IMessage
                                    })
                                }
                            },
                            { type: 'separator' },
                            {
                                type: 'button',
                                label: 'Delete blog',
                                icon: 'trash',
                                click: () => {
                                    const { windowId } = windows.create({
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
                                                        const [result, status] = await $api.blogs.delete(blog.value._id);

                                                        if (status !== 200) return;

                                                        $router.push('/blogs');

                                                        windows.close(windowId);
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
        }
    } as ItemButton;
}

function blogContextMenu() {
    contextMenu.create({
        name: `blog:options`,
        position: ['bottom', isHeaderActive.value ? 'right' : 'left', 'fixed', 'corner'],
        event: root.value?.querySelector('.blog-cm')!,
        items: [
            ...[isAdmin.value ? blogSettings() : {} as ItemButton],
            { type: 'separator' },
            {
                type: 'button',
                label: 'Copy Blog ID',
                click: () => {
                    copy(blog.value?._id);
                }
            }
        ]
    });
}




onMounted(() => {
    header.setOptions({ blur: { enable: false, value: '5px' } });

    const { _id, name } = selfBlog?.value;

    if (_id) {
        comments.setUrl([
            `/blogs/${_id}`,
            `/blogs/${name}`
        ]);
    }
});

onUnmounted(() => {
    header.setOptions({ blur: { enable: true, value: '5px' } });
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

.super.vertical.active {
    .page.blog {
        header {
            height: calc(100vh - 72px);
        }
    }
}

.super.horizontal.active {
    .page.blog {
        header {
            height: calc(100vh - 72px - 96px);
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
            overflow: hidden;
            z-index: -1;
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

        .list {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }

        @media (max-width: 1140px) {
            .list {
                grid-template-columns: 1fr 1fr 1fr;
            }
        }

        @media (max-width: 640px) {
            .list {
                grid-template-columns: 1fr;
            }
        }
    }

    @media (max-width: 840px) {
        header {
            padding: 15% 10%;

            & + div {
                .list {
                    grid-template-columns: 1fr 1fr;
                }
            }
        }
    }

    @media (max-width: 1140px) {
        header + div .list {
            grid-template-columns: 1fr 1fr 1fr;
        }
    }

    @media (max-width: 640px) {
        header + div .list {
            grid-template-columns: 1fr;
        }
    }
}

</style>