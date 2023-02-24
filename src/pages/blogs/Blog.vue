<template>
    <div class="blog">
        <header :class="{ active: headerActive }">
            <div class="image" :style="{ '--image': `url('${image}')` }"></div>

            <div class="data">0 seconds ago</div>
            <div class="title">Guidelines for Designing a Catalog and Product Page for Products with Multiple Options</div>
            
            <Transition name="height">
                <div class="scroll" v-show="!headerActive" @click="scrollProps?.toScroll(0, getWinHeight / 2)">Scroll down</div>
            </Transition>

            <Transition>
                <div class="description" v-show="headerActive">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum possimus sit, cupiditate quas inventore eius.
                </div>
            </Transition>
        </header>

        <div class="content">
            <div class="separator">Start</div>

            <h1>Lorem ipsum dolor sit amet.</h1>

            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore corporis sed delectus ipsum, excepturi quae minus voluptatem, amet enim numquam, veniam necessitatibus? Debitis adipisci harum id itaque, voluptate consequuntur ipsam inventore sequi, qui, vero exercitationem doloremque eum? Exercitationem reiciendis rerum repellat quos porro dolor voluptatibus inventore, laudantium natus corrupti, laborum, temporibus laboriosam eos asperiores consectetur. Libero tenetur quae cumque porro numquam temporibus saepe eius harum corporis consequuntur itaque qui distinctio eum vero reiciendis, fugit quasi sequi cum eligendi voluptates odit dolore! Nemo quibusdam quia nostrum voluptatem repellat ea unde ducimus debitis est hic facere aperiam, laborum consectetur repudiandae, accusamus excepturi ratione, inventore odio dolore? Facilis odio, a, nemo excepturi repellat velit molestiae quae iure consectetur impedit cupiditate dolores, veniam adipisci quibusdam ullam alias nihil voluptatem nostrum aliquam corrupti?</p>

            <h2>Lorem ipsum dolor sit amet.</h2>

            <h3>Lorem ipsum dolor sit amet.</h3>

            <h4>Lorem ipsum dolor sit amet.</h4>

            <h5>Lorem ipsum dolor sit amet.</h5>

            <h6>Lorem ipsum dolor sit amet.</h6>

            <div class="separator">The End</div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'BlogPage',
    components: {},
    computed: {
        ...mapGetters(['getWinHeight']),
        headerActive(): boolean {
            return this.scrollProps?.scrollY > (this.getWinHeight / 3);
        }
    },
    props: {
        scrollProps: {
            type: Object
        }
    },
    data: () => ({
        image: 'https://kartinkin.net/pics/uploads/posts/2022-08/1659385713_18-kartinkin-net-p-doski-piksel-art-oboi-20.jpg'
    }),
    watch: {},
    methods: {},
    mounted() {},
    unmounted() {}
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

.page.blog {
    padding: 0 !important;

    header {
        display: flex;
        padding: 5vh 10vw;
        width: 100vw;
        height: 100vh;
        align-items: flex-start;
        justify-content: flex-end;
        flex-direction: column;
        box-sizing: border-box;
        transition: .2s;

        &.active {
            transform: translateY(2.5vw);
            .image {
                border-radius: 15px;
                transform: translateY(-10vw) scale(.8);
                opacity: .5;

                &::after {
                    transform: scale(1.4);
                    filter: blur(5px);
                    // box-shadow: 0 -100px 100px 100px var(--background-primary) inset;
                }
            }
        }
        
        .image {
            width: 100vw;
            height: 100vh;
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
        padding: 5vh 10vw;

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