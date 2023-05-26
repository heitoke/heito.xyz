<template>
    <div class="projects">
        <NavBar orientation="vertical" :menu="[
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
        ]" style="margin: 0 12px 0 0; max-width: 196px;"
            :default-id="['projects', 'repos'].findIndex(t => t === type)"
            @select="$router.push(`/${$event.value}`)"
        />

        <div style="width: 100%;">
            <div class="filters" style="display: flex; margin: 0 0 12px 0; align-items: center;">
                <Textbox label="Search" style="margin: 0 12px 0 0;"
                    @input="filters.text = ($event.target as any)?.value"
                />
                <Select label="Sort" :value="filters.type" @select="filters.type = $event.value"
                    :menu="[
                        {
                            label: 'by Name',
                            icon: 'search-alt',
                            value: 'name'
                        },
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
                    ]"
                />
            </div>

            <Loading style="margin: 12px 0 0 0;" v-if="loading"/>

            <Alert v-else-if="(type === 'repos' && getListRepos?.length < 1) || (type === 'projects' && getListProjects?.length < 1)"/>

            <TransitionGroup tag="div" class="grid" name="projects" v-if="type === 'projects'">
                <Project v-for="(project, idx) in getListProjects" :key="idx" :project="project"
                    @click="$windows.create({ title: `Project ${project.title}`, component: 'Project' });"
                    :style="{ '--d': `${.05 * (idx & 5)}s` }"
                />
            </TransitionGroup>

            <Alert v-if="projects?.length < 1"/>
            
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

export default defineComponent({
    name: 'ProjectsPage',
    components: {},
    computed: {
        getListProjects() {
            let projects = [...this.projects || []],
                type = this.filters.type;

            // let sort = projects.sort((a: any, b: any) => {
            //     if (type === 'name') return (a.name > b.name) as any;
            //     if (type === 'stars') return (a.stargazers_count < b.stargazers_count) as any;
            //     if (type === 'watchers') return (a.watchers_count < b.watchers_count) as any;
            //     if (type === 'forks') return (a.forks_count < b.forks_count) as any;
            // });

            let regex = new RegExp(this.filters.text.trim(), 'gi');

            return projects.filter(({ title, description }) => regex.test(title) || regex.test(description));
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
            type: Object
        }
    },
    data: () => ({
        filters: {
            text: '',
            type: 'name'
        },
        projects: [
            ...new Array(5).fill({
                title: 'Project',
                image: 'https://kartinkin.net/pics/uploads/posts/2022-08/1659385713_18-kartinkin-net-p-doski-piksel-art-oboi-20.jpg',
                description: 'Description',
                createdAt: Date.now()
            })
        ],
        loading: false,
        repos: [] as IRepository[]
    }),
    watch: {
        'scrollProps.scrollY'(newValue: number) {
            if ((newValue + 1) >= this.scrollProps?.scrollMaxHeight && !this.loading && (this.repos?.length % 30) === 0) {
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
        async loadRepos(page: number = 1) {
            this.loading = true;

            let res = await fetch(`https://api.github.com/users/${this.login}/repos?page=${page}`),
                repos = await res.json();

            if (res.status !== 200) {
                this.loading = false;
                return;
            }

            this.repos = [...this.repos || [], ...repos];

            this.loading = false;
        }
    },
    mounted() {
        console.log(this.type, this.login);
        
        if (this.type === 'repos') {
            this.loadRepos();
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
}

</style>