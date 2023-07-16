<template>
    <div class="docs">
        <NavBar
            :default-id="getButtons.findIndex(b => b.value === getCategoty?.name)"
            :orientation="$win.size.width > 740 ? 'vertical' : 'horizontal'"
            :menu="getButtons"
            @select="$router.push(`/docs/${$event.value}`)"
        />

        <main v-if="!error">
            <div class="header">
                <div class="title">
                    <Icon :name="getCategoty?.icon"/>
                    <Text class="name" :text="getCategoty?.label"/>

                    <div style="margin: 0 0 0 auto;"></div>

                    <div :class="['version', getCategoty?.version]">{{ getCategoty?.version }}</div>

                    <div class="l"></div>

                    <div class="path"
                        @click="copy(`${$api.domain}${getCategoty?.path}`)"
                        @mouseenter="toolpics.set({ text: 'Click to copy' })"
                    >
                        {{ $api.domain }}{{ getCategoty?.path }}
                    </div>

                    <div class="l"></div>

                    <div class="routes"><span>{{ getCategoty?.routes?.length }}</span> routes</div>
                </div>

                <Text class="description" :text="getCategoty?.description" v-if="getCategoty?.description"/>

                <div style="margin: 12px 0 0 0;" v-if="getCategoty?.permissions?.length! > 0">
                    <div class="subtitle">Permissions</div>
                    <ul class="permissions">
                        <li v-for="per of listPermissions?.filter(per => getCategoty?.permissions?.find(p => p === per.value))" :key="per.value"
                            @pointerenter="toolpics.set({ text: per?.text })"
                        >
                            <Icon :name="per.icon"/>
                            <div>{{ per.label }}</div>
                        </li>
                    </ul>
                </div>
            </div>
            
            <Transition name="list">
                <ul v-if="getRoutes?.length > 0">
                    <TransitionGroup name="route">
                        <li v-for="(route, idx) of getRoutes" :key="route.label"
                            :class="{ active: open.includes(`r-${idx}`) }"
                        >
                            <header @click="clickOpenRoute(idx)">
                                <Icon :name="route?.icon" v-show="route?.icon" style="margin: 0 16px 0 0;"/>
                                <div class="title">
                                    <div>{{ route.label }}</div>
                                    <div>{{ route?.description }}</div>
                                </div>

                                <div class="m"></div>

                                <div class="path"
                                    @click.prevent.stop="copy(`${route?.method} ${$api.domain}${getCategoty?.path}${route.path || '/'}`)"
                                    @click.right.prevent.stop="copy(`${$api.domain}${getCategoty?.path}${route.path || '/'}`)"
                                    @mouseenter="toolpics.set({ title: 'Click to copy', text: 'Right-click without method' })"
                                >
                                    {{ route.path || '/' }}
                                </div>

                                <div class="l"></div>

                                <div class="method" :style="{ 'background-color': methodColors[route.method!] }">{{ route.method }}</div>

                                <Icon name="arrow-left"/>
                            </header>

                            <Height :showed="open.includes(`r-${idx}`)">
                                <APIRouteData :route="route"/>
                            </Height>
                        </li>
                    </TransitionGroup>
                </ul>
                <Alert v-else/>
            </Transition>
        </main>

        <main v-else>
            We could not find such an API
        </main>
    </div>
</template>

<script lang="ts" setup>

import NavBar from '~/components/content/NavBar.vue';

import APIRouteData from '~/components/models/docs/APIRouteData.vue';

import { ICategory, IRoute } from '~/types/api';
import { listPermissions } from '~/types/api/user';

const { $api, $win } = useNuxtApp();

const route = useRoute();

const toolpics = useToolpicsStore();

const
    error = ref<boolean>(false),
    open = ref<Array<string>>([]);

const methodColors = {
    GET: 'var(--green)',
    POST: 'var(--yellow)',
    HEAD: 'var(--green-alt)',
    OPTIONS: 'var(--orange)',
    PATCH: 'var(--purple)',
    PUT: 'var(--blue)',
    DELETE: 'var(--red)'
}


const getCategoty = computed(() => {
    const category = $api.categories.find(category => category.name === route.params.name);

    if (!category?.name) {
        error.value = true;

        return {} as ICategory;
    }

    error.value = false;

    return category!;
});

const getButtons = computed(() => {
    return $api.categories.map(category => ({
        label: category?.label || category.name,
        value: category.name,
        icon: category?.icon
    }));
});

const getRoutes = computed(() => {
    return getCategoty.value.routes || [];
});


function clickOpenRoute(idx: number) {
    const name = `r-${idx}`;

    if (open.value.includes(name)) {
        open.value = open.value.filter(r => r !== name);
    } else {
        open.value = [...open.value || [], name];
    }
}


useSeoMeta({
    title: `${getCategoty.value?.label || getCategoty.value?.name} | Documentations`
});


definePageMeta({
    title: 'Documentations',
    path: '/docs/:name?',
    alias: [
        '/doc/:name?',
        '/documentations/:name?',
        '/documentation/:name?'
    ],
    index: 5,
    mainPage: '/docs/users'
});

</script>


<style lang="scss" scoped>

.route-enter-active,
.route-leave-active {
    transition: all .2s;
    opacity: 0;
}

.list-enter-active,
.list-leave-active {
    transition: .2s;
    opacity: 0;
}

.page.docs {
    display: flex;
    margin: 32px 0 0 0;
    padding: 0 10%;
    position: relative;

    .nav-bar {
        max-width: 215px;
        min-width: 215px;
    }

    main {
        margin: 0 0 0 16px;
        max-width: calc(100% - 215px);
        width: 100%;
        height: 100%;

        .header {
            margin: 0 0 12px 0;
            padding: 24px;
            border-radius: 5px;
            border: 5px dashed var(--background-secondary);

            .title {
                display: flex;
                align-items: center;

                i, .name {
                    font-size: 20px;
                }

                i {
                    margin: 0 12px 0 0;
                }

                .version {
                    padding: 6px 12px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    border-radius: 5px;
                    user-select: none;

                    &.stable {
                        color: var(--green);
                        background-color: var(--green-alpha);
                    }

                    &.beta {
                        color: var(--yellow);
                        background-color: var(--yellow-alpha);
                    }

                    &.disabled {
                        color: var(--red);
                        background-color: var(--red-alpha);
                    }
                }

                .path {
                    cursor: pointer;
                    padding: 6px 12px;
                    color: var(--text-secondary);
                    font-size: 12px;
                    border-radius: 5px;
                    background-color: var(--background-secondary-alt);
                    opacity: .8;
                    transition: .2s;
                    user-select: none;

                    &:active {
                        transform: scale(.95);
                    }

                    &:hover {
                        opacity: 1;
                    }
                }

                .routes {
                    color: var(--text-secondary);

                    span {
                        color: var(--main-color);
                    }
                }
            }

            .l {
                margin: 0 12px;
                height: 24px;
                border: 1px solid var(--background-secondary);
            }

            ul.permissions {
                display: flex;
                margin: 8px 0 0 0;
                align-items: center;
                flex-wrap: wrap;

                li {
                    display: flex;
                    margin: 0 8px 0 0;
                    padding: 6px 12px;
                    position: relative;
                    color: var(--text-secondary);
                    border-radius: 5px;
                    border: 1px solid var(--background-secondary);
                    align-items: center;

                    &:last-child {
                        margin: 0;
                    }

                    i {
                        margin: 0 8px 0 0;
                        font-size: 14px;
                    }

                    span {
                        font-size: 12px;
                    }
                }
            }
        }

        .subtitle {
            color: var(--text-secondary);
            font-size: 12px;
            text-transform: uppercase;
        }

        ul {
            li {
                margin: 0 0 1px 0;
                transition: all .2s;

                .m {
                    margin: 0 0 0 auto;
                }

                .l {
                    margin: 0 12px;
                    height: 20px;
                    border-left: 1px solid var(--text-secondary);
                    opacity: .8;
                }

                header {
                    cursor: pointer;
                    display: flex;
                    padding: 12px 24px;
                    align-items: center;
                    background-color: var(--background-secondary);
                    transition: .2s;

                    .title {
                        div:nth-child(2) {
                            color: var(--text-secondary);
                            font-size: 12px;
                        }
                    }

                    .path {
                        padding: 4px 8px;
                        color: var(--text-secondary);
                        font-size: 12px;
                        border-radius: 5px;
                        background-color: var(--background-primary);
                    }

                    .method {
                        padding: 4px 8px;
                        color: var(--background-secondary);
                        color: #000;
                        font-size: 12px;
                        font-weight: 700;
                        border-radius: 5px;
                        user-select: none;
                    }

                    i.i-arrow-left {
                        margin: 0 0 0 16px;
                        color: var(--text-secondary);
                        transition: .2s;
                    }
                }

                &.active {
                    margin: 0 0 8px 0;

                    &:last-child {
                        header {
                            border-radius: 0 !important;
                        }
                    }

                    header {
                        i.i-arrow-left {
                            color: var(--main-color);
                            transform: rotate(-90deg);
                        }
                    }
                }

                &:hover {
                    header {
                        background-color: var(--background-secondary-alt);
                    }

                    .data {
                        border-color: var(--background-secondary-alt);
                    }
                }

                &:first-child {
                    header {
                        border-radius: 5px 5px 0 0;
                    }
                }

                &:last-child {
                    margin: 0;

                    header {
                        border-radius: 0 0 5px 5px;
                    }
                }

                .api-route-data {
                    padding: 12px 24px;
                    width: 100%;
                    // height: 256px;
                    border-radius: 0 0 5px 5px;
                    border: 3px solid var(--background-secondary);
                    border-top: none;
                    box-sizing: border-box;
                    transition: .2s;
                }
            }
        }
    }

    @media (max-width: 740px) {
        display: block;
        padding: 0 5%;

        .nav-bar {
            max-width: 100%;
        }
    
        main {
            margin: 16px 0 0 0;
            max-width: 100%;
        }
    }
}

</style>