<template>
    <div :class="['super', { active }]">
        <ScrollBar v-slot="scrollProps">
            <Transition name="page">
                <component :is="component" :class="['page', { 'to-left': $notifications?.options?.active }]"
                    :scrollProps="scrollProps"
                ></component>
            </Transition>
            <Transition name="go-top">
                <div class="go-top" v-show="!($route.meta?.hide as any)?.includes('go-top') && scrollProps?.scrollY > (winHeight / 2)"
                    @click="goTop(scrollProps)" 
                >
                    <Icon name="arrow-up"/>
                </div>
            </Transition>
            <Footer v-if="!($route.meta?.hide as any)?.includes('footer')"/>
        </ScrollBar>

        <Transition name="menu">
            <div class="menu" v-if="active">
                <div class="subtitle">Pages</div>
                <ul class="pages">
                    <li v-for="route of getRoutes" :key="route.name"
                        :class="{ active: $route.name === route.name }"
                        @click="$router.push(route.path)"
                    >
                        <span>{{ route?.meta?.title || route.name }}</span>
                        <Icon :name="route.meta?.icon" v-if="route.meta?.icon"/>
                    </li>
                </ul>
                <div class="line"></div>
                <div style="margin: auto 0 0 0; width: 100%;">
                    <div class="line"></div>
                    <ul class="buttons">
                        <li @click="$windows.create({ component: 'Setting' })">
                            <Icon name="settings"/>
                        </li>
                        <li @click="$notifications.setActive(true)">
                            <Icon name="notification"/>
                        </li>
                    </ul>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

import Footer from '../Footer.vue';
import ScrollBar from '../ScrollBar.vue';

</script>

<script lang="ts">

import { type Component, PropType, defineComponent } from 'vue';

export default defineComponent({
    name: 'VerticalSuperMode',
    computed: {
        getRoutes() {
            return this.$router?.options.routes.filter(route => !(route.meta?.hide as any)?.includes('page'));
        }
    },
    data: () => ({
        winHeight: 0
    }),
    props: {
        component: {
            type: Object as PropType<Component>,
            required: true
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        goTop(scrollProps: any) {
            scrollProps?.toScroll(0, scrollProps?.scrollY + 50);

            setTimeout(() => scrollProps?.toScroll(0, 0), 500)
        }
    },
    mounted() {
        this.winHeight = window?.innerHeight;
    }
});

</script>

<style lang="scss" scoped>

@keyframes MenuWidth {
    from {
        margin: 0;
        max-width: 0px;
        min-width: 0px;
        opacity: 0;
    }
    to {
        max-width: 256px;
        min-width: 256px;
    }
}

.menu-enter-active {
    animation: MenuWidth .2s linear;
}
.menu-leave-active {
    animation: MenuWidth .2s linear reverse;
}

.go-top-enter-active,
.go-top-leave-active {
    transform: translateY(32px) scale(.6);
    opacity: 0;
}

.super {
    display: flex;
    position: relative;
    max-width: 100vw;
    min-width: 100vw;
    max-height: 100vh;
    min-height: 100vh;
    box-sizing: border-box;
    transition: all .2s;

    .scrollbar {
        width: 100%;
        transition: all .2s;
        overflow: hidden;
    }

    .menu {
        display: flex;
        margin: 0 0 0 16px;
        min-width: 256px;
        flex-direction: column;
        transition: all .2s;

        ul.pages {
            li {
                cursor: pointer;
                display: flex;
                margin: 0 0 8px 0;
                padding: 8px 16px;
                color: var(--text-secondary);
                border-radius: 5px;
                // border: 1px solid var(--background-secondary);
                align-items: center;
                justify-content: flex-end;
                transition: .2s;

                &:last-child {
                    margin: 0;
                }

                &:hover {
                    color: var(--text-primary);
                }

                &.active {
                    color: var(--main-color);
                }

                .hx-icon {
                    margin: 0 0 0 8px;
                }
            }
        }

        .subtitle {
            margin: 8px 16px;
            color: var(--text-secondary);
            font-size: 12px;
            font-weight: 600;
            text-align: right;
            white-space: nowrap;
            text-transform: uppercase;
            opacity: .7;
        }

        .line {
            margin: 8px 16px;
            border-bottom: 1px solid var(--background-secondary);
            box-sizing: border-box;
        }

        ul.buttons {
            display: flex;
            padding: 0 16px;
            align-items: center;
            justify-content: flex-end;

            li {
                cursor: pointer;
                display: flex;
                margin: 0 8px 0 0;
                min-width: 32px;
                height: 32px;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                border: 1px solid var(--T);
                background-color: var(--background-secondary);
                transition: .2s;

                &:hover {
                    border-color: var(--main-color);
                }

                &:last-child {
                    margin: 0;
                }
            }
        }
    }

    .go-top {
        cursor: pointer;
        display: flex;
        width: 48px;
        height: 48px;
        position: absolute;
        right: 32px;
        bottom: 32px;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        background-color: var(--background-secondary);
        transition: .2s;

        &:hover {
            background-color: var(--background-secondary-alt);
        }

        &:active {
            transform: scale(.85);
        }
    }
    
    &.active {
        padding: 72px 8px 8px 8px;
        
        .scrollbar {
            max-height: calc(100% - 16px);
            border-radius: 15px;
        }
    }
}

</style>