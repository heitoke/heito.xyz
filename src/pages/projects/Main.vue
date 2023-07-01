<template>
    <div class="projects">
        <NavBar :orientation="getWinWidth > 840 ? 'vertical' : 'horizontal'"
            :menu="[
                {
                    icon: 'images',
                    label: 'Projects',
                    value: 'projects',
                    click: () => $router.push(`/projects`)
                },
                {
                    icon: 'repo',
                    label: 'Repositories',
                    value: 'repos',
                    click: () => $router.push(`/repositories`)
                }
            ]"
            :default-id="['projects', 'repos'].findIndex(t => t === type)"
            @select="$router.push(`/${$event.value}`)"
        />

        <div style="width: 100%;">
            <div class="filters">
                <Textbox
                    @input="filters.text = ($event.target as any)?.value"
                />

                <Select label="Sort" :value="filters.type" @select="filters.type = $event.value"
                    :menu="[
                        {
                            label: 'by Name',
                            icon: 'search-alt',
                            value: 'name'
                        },
                        ...(type === 'repos' ? filters.reposMenu : filters.projectsMenu)
                    ]"
                />

                <Button color="var(--green)" v-if="isAdmin"
                    @click="createProject"
                >Create</Button>
            </div>

            <Loading style="margin: 12px 0 0 0;" v-if="loading"/>

            <Alert v-else-if="(type === 'repos' && getListRepos?.length < 1) || (type === 'projects' && getListProjects?.length < 1)"/>

            <TransitionGroup tag="div" class="grid" name="projects" v-if="type === 'projects'">
                <Project v-for="(project, idx) in getListProjects" :key="idx" :project="project"
                    :style="{ '--d': `${.05 * (idx & 5)}s` }"
                />
            </TransitionGroup>
            
            <TransitionGroup tag="div" class="grid" name="projects" v-if="type === 'repos'">
                <Repository v-for="(repo, idx) in getListRepos" :key="idx" :repository="repo"
                    :style="{ '--d': `${.05 * (idx % 30)}s` }"
                />
            </TransitionGroup>
        </div>
    </div>
</template>

<script lang="ts" setup>

import Project from '../../components/cards/Project.vue';
import Repository, { IRepository } from '../../components/cards/Repository.vue';

import NavBar from '../../components/content/NavBar.vue';

</script>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import { mapGetters } from 'vuex';

import Projects, { IProject } from '../../libs/api/routes/projects';

import { EPermissions } from '../../libs/api/routes/users';
import type { IMessage } from '../../windows/Message.vue';

import type { IScrollBar } from '../../components/content/ScrollBar.vue';

export default defineComponent({
    name: 'ProjectsPage',
    components: {},
    computed: {
        ...mapGetters(['getUser', 'getWinWidth']),
        isAdmin() {
            return this.getUser?.permissions?.includes(EPermissions.Projects);
        },
        getListProjects() {
            let projects = [...this.projects || []],
                type = this.filters.type;

            let sort = projects.sort((a: any, b: any) => {
                if (type === 'name') return (a.name > b.name) as any;
                if (type === 'members') return (a.members.length < b.members.length) as any;
                if (type === 'date') return (a.createdAt > b.createdAt) as any;
            });

            let regex = new RegExp(this.filters.text.trim(), 'gi');

            return sort.filter(({ name, displayName, description }) => regex.test(name || '') || regex.test(displayName || '') || regex.test(description || ''));
        },
        getListRepos() {
            let repos = [...this.repos || []],
                type = this.filters.type;

            let sort = repos.sort((a: any, b: any) => {
                if (type === 'name') return (a.name > b.name) as any;
                if (type === 'stars') return (a.stargazers_count < b.stargazers_count) as any;
                if (type === 'watchers') return (a.watchers_count < b.watchers_count) as any;
                if (type === 'forks') return (a.forks_count < b.forks_count) as any;
            });

            let regex = new RegExp(this.filters.text.trim(), 'gi');

            return sort.filter(({ name, description, owner, language }) => regex.test(name) || regex.test(description) || regex.test(owner?.login) || regex.test(language));
        }
    },
    props: {
        login: {
            type: String,
            default: 'heitoke'
        },
        type: {
            type: String as PropType<'projects' | 'repos'>,
            default: 'projects'
        },
        scrollProps: {
            type: Object as PropType<IScrollBar>
        }
    },
    data: () => ({
        filters: {
            text: '',
            type: 'name',
            reposMenu: [
                {
                    label: 'by Stars',
                    icon: 'star-alt',
                    value: 'stars'
                },
                {
                    label: 'by Watchers',
                    icon: 'eye',
                    value: 'watchers'
                },
                {
                    label: 'by Forks',
                    icon: 'fork',
                    value: 'forks'
                }
            ],
            projectsMenu: [
                {
                    label: 'by Count members',
                    icon: 'users',
                    value: 'members'
                },
                {
                    label: 'by Date',
                    icon: 'clock',
                    value: 'date'
                }
            ]
        },
        projects: [] as Array<IProject>,
        loading: false,
        repos: [] as Array<IRepository>
    }),
    watch: {
        'scrollProps.scroll.top'(newValue: number) {
            if ((newValue + 1) >= this.scrollProps?.scroll.max.height! && !this.loading && (this.repos?.length % 30) === 0) {
                let nextPage = (this.repos?.length / 30) + 1;

                this.loadRepos(nextPage);
            }
        },
        'type'(newValue: string) {
            if (newValue === 'repos' && this.repos?.length < 1) {
                this.loadRepos();
            }
        }
    },
    methods: {
        async loadProjects() {
            this.loading = true;

            const [projects, status] = await Projects.list();

            if (status !== 200) {
                this.$notifications.error({
                    title: 'loading projects',
                    message: (projects as any)?.message,
                    status: status
                });

                return this.loading = false;
            }

            this.projects = [...this.projects || [], ...projects?.results];

            this.loading = false;
        },
        async loadRepos(page: number = 1) {
            this.loading = true;

            let res = await fetch(`https://api.github.com/users/${this.login}/repos?page=${page}`),
                repos = await res.json();

            if (res.status !== 200) {
                this.$notifications.error({
                    title: 'loading repos',
                    message: repos?.message,
                    status: res.status
                });

                return this.loading = false;
            }

            this.repos = [...this.repos || [], ...repos];

            this.loading = false;
        },
        async createProject() {
            const newProject = {
                name: ''
            };

            this.$windows.create({
                component: 'Message',
                data: {
                    title: 'Create new project',
                    icon: 'image',
                    components: [
                    {
                            component: 'Textbox',
                            name: 'name',
                            props: { label: 'Name', match: /^[a-zA-Z0-9\_]+$/ },
                            events: {
                                input(e: InputEvent) {
                                    newProject.name = (e.target as any)?.value;
                                }
                            }
                        }
                    ],
                    buttons: [
                        {
                            label: 'Create',
                            color: 'var(--green)',
                            click: async (e, data, windowId) => {
                                const [project, status] = await Projects.create(newProject as any);

                                if (status !== 200) return this.$notifications.error({
                                    title: 'creating project',
                                    message: (project as any)?.message,
                                    status
                                });

                                this.$notifications.push({
                                    title: 'New project',
                                    message: `Project ${project.name} was successfully created`,
                                    icon: 'image',
                                    color: 'var(--green)'
                                });

                                this.projects = [];
                                this.loadProjects();

                                this.$windows.close(windowId);
                            }
                        }
                    ]
                } as IMessage
            })
        }
    },
    mounted() {
        if (this.type === 'repos') {
            this.loadRepos();
        } else if (this.type === 'projects') {
            this.loadProjects();
        }
    }
});

</script>

<style lang="scss" scoped>

.projects-enter-active,
.projects-leave-active {
    transform: scale(.9);
    transition: all .5s;
    transition-delay: var(--d);
    opacity: 0;
}

.page.projects {
    display: flex;
    margin: 12px 0 0 0;
    padding: 0 10%;
    width: 100vw;
    height: auto;
    min-height: 100%;
    align-items: flex-start;

    .nav-bar {
        margin: 0 12px 0 0;
        max-width: 196px;
    }

    .filters {
        display: flex;
        margin: 0 0 12px 0;
        align-items: center;

        .ui-select {
            margin: 0 12px;
        }

        .ui-button {
            width: 96px;
        }
    }

    .menu {
        margin: 0 12px 0 0;
        min-width: 215px;
    }

    .grid {
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 12px;
        row-gap: 12px;
    }

    @media (max-width: 1140px) {
        .grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 840px) {
        display: block;
        padding: 0 5%;

        .nav-bar {
            margin: 0 0 16px 0;
            min-width: 100%;
        }
    }

    @media (max-width: 640px) {
        .filters {
            display: block;

            .ui-select {
                margin: 12px 0;
            }

            .ui-button {
                width: 100%;
            }
        }

        .grid {
            grid-template-columns: 1fr;
        }
    }
}

</style>