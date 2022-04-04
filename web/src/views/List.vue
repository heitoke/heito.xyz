<template>
    <div class="list">
        <div class="block">
            <div class="sidebar">
                <Select style="margin: 0 0 12px 0;" :items="[
                    { label: 'Manga', icon: 'uil uil-notebooks', value: 'manga', color: 'var(--C6)' },
                    { label: 'Anime', icon: 'uil uil-image', value: 'anime', color: 'var(--C1)' }
                ]" :value="$route.query?.type" @onEvent="router(`/list?type=${$event.value}`)"/>
                <ul class="categories" v-if="service?.categories && service?.categories.length > 0">
                    <li v-for="(btn, idx) of service?.categories" :key="(btn, idx)"
                        :class="{ 'active': service?.value === btn.id }"
                        @click="service['value'] === btn.id ? null : btn.click(); service['value'] = btn.id;"
                    >
                        <span>{{ btn.name }}</span>
                        <span v-if="btn?.count">{{ btn.count }}</span>
                    </li>
                </ul>
            </div>
            <main>
                <ul class="filter">
                    <li class="service" v-if="service?.service"
                        @mouseenter="openContextMenu([$event, `toolpic:service:name`, 'top center-x fixed hover'])"
                        @mouseleave="closeContextMenu()"
                        @click="redirect(service.service.url, true, true)"
                    >
                        <icon :data="service.service.icon"/>
                    </li>
                    <li class="btn" @click="cardType = !cardType"
                        @mouseenter="openContextMenu([$event, `toolpic:card:type`, 'top center-x fixed hover'])"
                        @mouseleave="closeContextMenu()"
                    >
                        <i :class="cardType ? 'uil uil-list-ul' : 'uil uil-apps'"></i>
                    </li>
                    <li class="btn" @click="sortType = !sortType"
                        @mouseenter="openContextMenu([$event, `toolpic:sort:type`, 'top center-x fixed hover'])"
                        @mouseleave="closeContextMenu()"
                    >
                        <i :class="sortType ? 'uil uil-angle-up' : 'uil uil-angle-down'"></i>
                    </li>
                    <component v-for="btn of service?.buttons" :key="btn" :is="btn?.component"
                        :items="btn?.items"
                        :value="btn?.value"
                        @onEvent="btn.on($event)"
                    />
                    <Text text="Search" @onEvent="text = $event"/>
                </ul>
                <div :class="`list-block ${cardType ? 'list' : 'card'}`">
                    <BlockManga :text="text.trim() !== '' ? text : ''" :sort="sortType" @onEvent="service = $event" v-if="$route.query.type === 'manga'"/>
                    <BlockAnime :text="text.trim() !== '' ? text : ''" :sort="sortType" @onEvent="service = $event" v-if="$route.query.type === 'anime'"/>
                </div>
            </main>

            <!-- Toolpic -->

            <ContextMenu name="toolpic:service:name" class="toolpic">
                <p>{{ service.service.name }}</p>
            </ContextMenu>
            <ContextMenu name="toolpic:card:type" class="toolpic">
                <p>{{ cardType ? 'List' : 'Block' }}</p>
            </ContextMenu>
            <ContextMenu name="toolpic:sort:type" class="toolpic">
                <p>{{ sortType ? 'Ascending' : 'Descending' }}</p>
            </ContextMenu>
        </div>
    </div>
</template>

<script>

import BlockManga from '../components/list/manga.vue'
import BlockAnime from '../components/list/anime.vue'

export default {
    name: 'ListPage',
    components: { BlockManga, BlockAnime },
    computed: {},
    data() {
        return {
            type: 'name',
            text: '',
            listType: '',
            cardType: true, // list - true | block - false
            sortType: false, // up - true | down - false
            service: null,
            buttons: [
                { label: 'Manga', name: 'manga' },
                { label: 'Anime', name: 'anime' }
            ]
        }
    },
    methods: {
        setType(type) {
            this.router(`/list?type=${type}`)
        }
    },
    mounted() {
        let type = this.buttons.find(item => item.name === this.$route.query?.type);
        this.setType(type ? type?.name : 'manga');
    }
}
</script>

<style lang="scss">

.page.list .block {
    display: flex;
    margin: 0 auto;
    max-width: 70%;

    .sidebar {
        margin: 0 12px 0 0;
    }

    .categories {
        min-width: 196px;
        user-select: none;

        li {
            cursor: pointer;
            display: flex;
            margin: 0 0 4px 0;
            padding: 8px 16px;
            color: var(--color-2);
            font-size: 14px;
            border-radius: 5px;
            align-items: center;
            justify-content: space-between;
            transition: .2s;

            &:last-child {
                margin: 0;
            }

            &:hover, &.active {
                background: var(--dimming);
            }

            &.active {
                color: var(--color);
            }

            span {
                &:nth-child(2) {
                    padding: 2px 4px;
                    min-width: 16px;
                    text-align: center;
                    border-radius: 3px;
                    background: var(--bg-2);
                }
            }
        }
    }

    main {
        width: 100%;

        .list-block {
            margin: 12px 0 0 0;

            ul {
                li {
                    cursor: pointer;
                    transition: .2s;
                    overflow: hidden;

                    .bg {
                        position: relative;
                        border-radius: 5px;
                        background-size: cover;
                        background-position: 50% 50%;
                    }

                    .header {
                        .name {
                            transition: .2s;
                        }

                        .stats {
                            user-select: none;
                        }
                    }
                }
            }

            &.list ul {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0;
                border-radius: 5px;
                background: var(--dimming);

                li {
                    cursor: pointer;
                    display: flex;
                    padding: 16px;
                    border-bottom: 1px solid var(--bg-2);
                    align-items: center;
                    transition: .2s;
                    overflow: hidden;

                    &:hover {
                        background: var(--bg);
                    }

                    .bg {
                        margin: 0 16px 0 0;
                        width: 96px;
                        min-height: 128px;

                        .progress { display: none; }
                    }

                    .header {
                        .name {
                            font-weight: 700;
                        }
                        
                        .readed {
                            color: var(--color-2);
                            font-size: 14px;
                        }

                        .stats {
                            display: flex;
                            margin: 4px 0 0 0;
                            font-size: 14px;
                            align-items: center;
                            flex-wrap: wrap;

                            div {
                                margin: 0 4px 0 0;
                                padding: 2px 8px;
                                border-radius: 5px;
                                background: var(--bg-2);

                                i {
                                    margin: 0 4px 0 0;
                                    width: 16px;
                                }
                            }
                        }
                    }
                }
            }

            &.card ul {
                columns: 6;

                li {
                    margin: 0 0 12px 0;

                    &:hover {
                        transform: translateY(-8px);

                        .name {
                            color: var(--color);
                        }
                    }

                    .bg {
                        margin: 0 0 4px 0;
                        width: 100%;
                        min-height: 225px;

                        .progress {
                            padding: 2px 4px;
                            position: absolute;
                            bottom: 4px;
                            right: 4px;
                            font-size: 12px;
                            border-radius: 5px;
                            background: #000000bc;
                        }
                    }

                    .header {
                        .name {
                            color: var(--color-2);
                            font-size: 14px;
                        }

                        .readed, .stats { display: none; }
                    }
                }
            }
        }
    }

    .filter {
        display: flex;
        align-items: center;

        li.btn {
            cursor: pointer;
            margin: 0 8px 0 0;
            min-width: 36px;
            height: 36px;
            text-align: center;
            line-height: 36px;
            border-radius: 5px;
            background: var(--dimming);
        }

        li.service {
            cursor: pointer;
            margin: 0 8px 0 0;
            padding: 8px;
            text-align: center;
        }

        .field-select {
            margin: 0 8px 0 0;
            min-width: 156px;
            white-space: nowrap;

            div {
                height: 40px;
            }
        }
    }
}

</style>