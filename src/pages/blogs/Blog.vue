<template>
    <div class="blog">
        <header :class="{ active: headerActive }">
            <div class="image" :style="{ '--image': `url('${image}')` }"></div>

            <div ref="headerContent" :style="{ '--header-content-height': `${($refs.headerContent as Element)?.clientHeight}px` }">
                <div class="date">0 seconds ago</div>
                <div class="title">Guidelines for Designing a Catalog and Product Page for Products with Multiple Options</div>
                
                <Transition name="height">
                    <div class="scroll" v-show="!headerActive" @click="scrollProps?.toScroll(0, getWinHeight / 2)">Scroll down</div>
                </Transition>

                <Transition>
                    <div class="description" v-show="headerActive">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum possimus sit, cupiditate quas inventore eius.
                    </div>
                </Transition>
            </div>
        </header>

        <div class="content">
            <div class="separator">Start</div>

            <Markdown :text="content"/>

            <div class="separator">The End</div>

            <CarouselTab :gap="12" :column="4">
                <Blog v-for="(a, id) of new Array(25).fill(blog)" :key="id" :blog="a"
                    @click="$router.push(`/blogs/${id}`)"
                />
            </CarouselTab>
        </div>

    </div>
</template>

<script lang="ts" setup>

import Blog from '../../components/cards/Blog.vue';

import CarouselTab from '../../components/content/CarouselTab.vue';

import Markdown from '../../components/content/Markdown.vue';

</script>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import { mapGetters, mapActions } from 'vuex';

import type { IScrollBar } from '../../components/content/ScrollBar.vue';

export default defineComponent({
    name: 'BlogPage',
    components: {},
    computed: {
        ...mapGetters(['getWinHeight']),
        headerActive(): boolean {
            return this.scrollProps?.scroll.top! > (this.getWinHeight / 3);
        }
    },
    props: {
        scrollProps: {
            type: Object as PropType<IScrollBar>
        }
    },
    data: () => ({
        image: 'https://kartinkin.net/pics/uploads/posts/2022-08/1659385713_18-kartinkin-net-p-doski-piksel-art-oboi-20.jpg',
        content: `
# Welcome to StackEdit!

Hi! I'm your first Markdown file in **StackEdit**. If you want to learn about StackEdit, you can read me. If you want to play with Markdown, you can edit me. Once you have finished with me, you can create new files by opening the **file explorer** on the left corner of the navigation bar.


# Files

StackEdit stores your files in your browser, which means all your files are automatically saved locally and are accessible **offline!**

## Create files and folders

The file explorer is accessible using the button in left corner of the navigation bar. You can create a new file by clicking the **New file** button in the file explorer. You can also create folders by clicking the **New folder** button.

## Switch to another file

All your files and folders are presented as a tree in the file explorer. You can switch from one to another by clicking a file in the tree.

## Rename a file

You can rename the current file by clicking the file name in the navigation bar or by clicking the **Rename** button in the file explorer.


* rtee
* фывфыв
    * фвы
    * выфывф
        * вфыфыв
    * фвы
* ывф

|                |ASCII                          |HTML                         |
|----------------|-------------------------------|-----------------------------|
|Single backticks|\`'Isn't this fun?'\`            |'Isn't this fun?'            |
|Quotes          |\`"Isn't this fun?"\`            |"Isn't this fun?"            |
|Dashes          |\`-- is en-dash, --- is em-dash\`|-- is en-dash, --- is em-dash|
`,
        blog: {
            title: 'Blog Blog Blog Blog Blog Blog Blog Blog Blog Blog Blog Blog',
            description: 'Description',
            image: 'https://avatars.mds.yandex.net/i?id=79ebacfe308fb494ac056a01cb3cba3840e07e0c-8350343-images-thumbs&n=13',
            tags: [
                'new'
            ],
            category: 'void',
            createdAt: Date.now()
        }
    }),
    watch: {
        headerActive(newValue) {
            this.setHeaderOptions({
                blur: {
                    enable: newValue,
                    value: '5px'
                }
            });
        }
    },
    methods: {
        ...mapActions(['setHeaderLoading', 'setHeaderOptions'])
    },
    mounted() {
        this.setHeaderOptions({
            blur: {
                enable: false
            }
        });

        let n = 0;
        setInterval(() => {
            this.setHeaderLoading({
                process: n
            })

            n++;
        }, 100);
    },
    unmounted() {
        this.setHeaderOptions({
            blur: {
                enable: true,
                value: '5px'
            }
        });
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
            transition: .2s;
        }

        &.active {
            transform: translateY(64px);

            .image {
                border-radius: 15px;
                transform: translateY(-169px) scale(.8);
                opacity: .5;

                &::after {
                    transform: scale(1.4);
                    filter: blur(5px);
                    // box-shadow: 0 -100px 100px 100px var(--background-primary) inset;
                }
            }

            & > div {
                transform: translateY(calc(var(--header-content-height) - (var(--header-content-height) / 2)));
            }

            .date, .title, .scroll {
                color: var(--text-primary);
                mix-blend-mode: none;
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
    }

    .content {
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