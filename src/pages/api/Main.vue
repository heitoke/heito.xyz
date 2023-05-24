<template>
    <div class="api">
        <NavBar style="width: 256px;"
            :default-id="getButtons.findIndex(b => b.value === getCategoty?.name)"
            :orientation="'vertical'"
            :menu="getButtons"
            @select="$router.push(`/api/${$event.value}`)"
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
                        @click="copy(`${getDomain}${getCategoty?.path}`)"
                        @mouseenter="setToolpic({ text: 'Click to copy' })"
                    >
                        {{ getDomain }}{{ getCategoty?.path }}
                    </div>

                    <div class="l"></div>

                    <div class="routes"><span>{{ getCategoty?.routes?.length }}</span> routes</div>
                </div>

                <Text class="description" :text="getCategoty?.description"/>

                <div style="margin: 12px 0 0 0;" v-if="getCategoty?.permissions?.length! > 0">
                    <div class="subtitle">Permissions</div>
                    <ul class="permissions">
                        <li v-for="per of listPermissions?.filter(per => getCategoty?.permissions?.find(p => p === per.value))" :key="per.value"
                            @pointerenter="setToolpic({ text: per?.text })"
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
                            :class="{ active: route.open }"
                        >
                            <header @click="route.open = !route.open">
                                <Icon :name="route?.icon" v-show="route?.icon" style="margin: 0 16px 0 0;"/>
                                <div class="title">
                                    <div>{{ route.label }}</div>
                                    <div>{{ route?.description }}</div>
                                </div>

                                <div class="m"></div>

                                <div class="path"
                                    @click.prevent.stop="copy(`${route?.method} ${getDomain}${getCategoty?.path}${route.path || '/'}`)"
                                    @click.right.prevent.stop="copy(`${getDomain}${getCategoty?.path}${route.path || '/'}`)"
                                    @mouseenter="setToolpic({ title: 'Click to copy', text: 'Right-click without method' })"
                                >
                                    {{ route.path || '/' }}
                                </div>

                                <div class="l"></div>

                                <div class="method" :style="{ 'background-color': methodColors[route.method!] }">{{ route.method }}</div>

                                <Icon name="arrow-left"/>
                            </header>

                            <Transition name="data">
                                <APIRouteData :route="route" v-if="route.open"/>
                            </Transition>
                        </li>
                    </TransitionGroup>
                </ul>
                <div class="no" v-else>So far there is nothing here o_O</div>
            </Transition>
        </main>
        <main v-else>
            We could not find such an API
        </main>
    </div>
</template>

<script lang="ts" setup>

import NavBar from '../../components/content/NavBar.vue';

import APIRouteData from '../../components/other/api/APIRouteData.vue';

import { listPermissions } from '../../libs/api/routes/users';

import { copy } from '../../libs/functions';

</script>

<script lang="ts">

import { defineComponent, reactive } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import $api, { categories, ICategory, IRoute } from '../../libs/api';
import Logs from '../../libs/api/routes/logs';
import Configs from '../../libs/api/routes/configs';
import Blogs from '../../libs/api/routes/blogs';
import Projects from '../../libs/api/routes/projects';
import Auth from '../../libs/api/routes/auth';

interface Route extends IRoute {
    open: boolean;
}

export default defineComponent({
    name: 'APIPage',
    components: {},
    computed: {
        ...mapGetters([]),
        getCategories(): Array<ICategory> {
            return categories || [];
        },
        getCategoty(): ICategory {
            const category = categories.find(category => category.name === (this.$route.params.routerName));

            if (!category?.name) {
                this.error = true;
                return {} as ICategory;
            }

            this.error = false;

            return category!;
        },
        getButtons() {
            return this.getCategories.map(category => ({
                label: category?.label || category.name,
                value: category.name,
                icon: category?.icon
            }));
        },
        getDomain() {
            return $api.getDomain();
        },
        getRoutes(): Array<Route> {
            return reactive(this.getCategoty?.routes as Route[] || []);
        }
    },
    data: () => ({
        error: false,
        methodColors: {
            GET: 'var(--green)',
            POST: 'var(--yellow)',
            HEAD: 'var(--green-alt)',
            OPTIONS: 'var(--orange)',
            PATCH: 'var(--purple)',
            PUT: 'var(--blue)',
            DELETE: 'var(--red)',
        }
    }),
    watch: {},
    methods: {
        ...mapActions(['setToolpic'])
    },
    mounted() {
        console.log(Auth, Logs, Configs, Projects, Blogs);
    }
});

</script>


<style lang="scss" scoped>

.route-enter-active,
.route-leave-active {
    transition: all .2s;
    opacity: 0;
}

.data-enter-active,
.data-leave-active {
    transform: translateY(-32px);
    transition: .2s;
    opacity: 0;
}
.data-enter-active {
    height: 256px;
}
.data-leave-active {
    height: 0px;
    max-height: 0px;
}

.list-enter-active,
.list-leave-active {
    transition: .2s;
    opacity: 0;
}

.page.api {
    display: flex;
    margin: 32px 0 0 0;
    padding: 0 10%;
    position: relative;

    main {
        margin: 0 0 0 16px;
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

        .no {
            padding: 48px;
            font-size: 20px;
            color: var(--text-secondary);
            text-align: center;
            text-transform: uppercase;
            border-radius: 15px;
            border: 5px dashed var(--text-primary);
            background-color: var(--main-color-alt);
        }
    }
}

</style>