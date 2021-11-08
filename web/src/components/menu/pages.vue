<template>
    <div class="pages">
        <ul class="list">
            <PageProjects :_page=options.projects :name="`projects`" :open="open === 'projects'"
                v-on:openSetting="openSetting"
            />
        </ul>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

import PageProjects from './pages/projects.vue'

export default {
    name: 'BlockMenuPages',
    props: {},
    computed: mapGetters(['']),
    components: { PageProjects },
    data() {
        return {
            open: 'projects',
            options: {
                projects: {
                    on: true,
                    list: [
                        {
                            on: false,
                            title: 'heito.xyz',
                            descriptions: '',
                            image: '',
                            banner: '',
                            points: [],
                            links: []
                        },
                        {
                            on: false,
                            title: 'Mirai',
                            descriptions: '',
                            image: '',
                            banner: '',
                            points: [],
                            links: []
                        },
                        {
                            on: false,
                            title: "Server Garry's Mod",
                            descriptions: '',
                            image: '',
                            banner: '',
                            points: [],
                            links: []
                        }
                    ]
                },
                friends: {
                    on: false
                }
            }
        }
    },
    sockets: {},
    methods: {
        openSetting(value) {
            return this.open = (this.open === value) ? false : value;
        }
    },
    mounted() {}
}

</script>

<style lang="scss">

.page.cms-menu .blocks .pages {
    .list {
        .block-page {
            margin: 8px 0 0 0;
            padding: 12px 24px;
            background: var(--bg-2);

            .header + .setting {
                margin: 16px 0 0 0;
            }

            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                user-select: none;
            }

            .setting {
                padding: 16px 0 0 0;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                border-top: 1px solid var(--color-3);
            }
        }
    }
}

</style>
