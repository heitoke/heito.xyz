<template>
    <div class="api">
        <NavBar style="width: 256px;" :orientation="'vertical'" :menu="getCategories.map(c => ({
            label: c?.label || c.name,
            value: c.name,
            icon: c?.icon
        }))" @select="type = $event.value!"/>

        <main>
            <Transition name="list">
                <ul v-if="getRoutes?.length > 0">
                    <TransitionGroup name="route">
                        <li v-for="(route, idx) of getRoutes" :key="route.label"
                            :class="{ active: route.open }"
                            :style="{ '--d': `${.05 * (idx % getRoutes?.length)}s` }"
                        >
                            <header @click="route.open = !route.open">
                                <Icon :name="route?.icon" v-show="route?.icon" style="margin: 0 16px 0 0;"/>
                                <div class="title">
                                    <div>{{ route.label }}</div>
                                    <div>{{ route?.description }}</div>
                                </div>
                                <div class="m"></div>
                                <div class="path">/{{ type }}{{ route.path }}</div>
                                <div class="l"></div>
                                <div class="method" :style="{ 'background-color': methodColors[route.method!] }">{{ route.method }}</div>

                                <Icon name="arrow-left"/>
                            </header>
                            <Transition name="data">
                                <div class="data" v-if="route.open"></div>
                            </Transition>
                        </li>
                    </TransitionGroup>
                </ul>
                <div class="no" v-else>So far there is nothing here o_O</div>
            </Transition>
        </main>
    </div>
</template>

<script lang="ts" setup>

import NavBar from '../../components/content/NavBar.vue';

</script>

<script lang="ts">

import { defineComponent, reactive } from 'vue';

import { mapGetters } from 'vuex';

import $api, { categories, ICategory, IRoute } from '../../libs/api';
import Logs from '../../libs/api/routes/logs';
import Configs from '../../libs/api/routes/configs';

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
        getDomain() {
            return $api.getDomain();
        },
        getRoutes(): Array<Route> {
            let index = categories.findIndex(c => c.name === this.type);

            if (index < 0) return [];
            
            return reactive(categories[index]?.routes as Route[] || []);
        }
    },
    data: () => ({
        type: '',
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
    methods: {},
    mounted() {
        this.type = categories[0].name;
        
        console.log(Logs);
        console.log(Configs);
    }
});

</script>


<style lang="scss" scoped>

.route-enter-active,
.route-leave-active {
    transition: all .2s;
    transition-delay: var(--d);
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

                .data {
                    width: 100%;
                    height: 256px;
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