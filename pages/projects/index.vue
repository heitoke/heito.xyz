<template>
    <div class="projects">
        <NavBar class="menu" :orientation="$win.size.width > 840 ? 'vertical' : 'horizontal'"
            :menu="[
                {
                    icon: 'images',
                    label: 'Projects',
                    click: () => $router.push(`/projects`)
                },
                {
                    icon: 'repo',
                    label: 'Repositories' + (getReposId ? ` (${getReposId})` : ''),
                    click: () => $router.push(`/repos`)
                }
            ]"
            :default-id="['projects', 'repos'].findIndex(p => p === type)"
        />

        <div>
            <div class="filters" v-if="config.getStatus === 'online' || type === 'repos'">
                <Textbox :label="`Search ${type === 'repos' ? 'repositories' : 'projects'}`"
                    @input="filters.text = ($event.target as any)?.value"
                />

                <Select label="Sort" :value="filters.type" @select="filters.type = $event.value"
                    :menu="[
                        {
                            label: 'by Name',
                            icon: 'search-alt',
                            value: 'name'
                        },
                        ...menu[type === 'repos' ? 'repos' : 'projects']
                    ]"
                />

                <Button color="var(--green)" v-if="isAdmin"
                    @click="createProject"
                >Create</Button>
            </div>
            
            
            <NavBar class="topics" v-if="config.getStatus === 'online' || type === 'repos'"
                :menu="topics"
                :multiselect="true"
                :clear-id="0"
                @select="selectTopic($event.label)"
            />


            <Loading style="margin: 12px 0 0 0;" v-if="loading"/>

            <Alert v-else-if="(type === 'repos' && getListRepos?.length < 1) || (type === 'projects' && getListProjects?.length < 1)"/>

            <div class="grid" v-if="type === 'projects'">
                <TransitionGroup name="projects">
                    <Project v-for="(project, idx) in getListProjects" :key="idx" :project="project"
                        :style="{ '--d': `${.05 * (idx & 5)}s` }"
                    />
                </TransitionGroup>
            </div>

            <div class="grid" v-if="type === 'repos'">
                <TransitionGroup name="projects">
                    <Repository v-for="(repo, idx) in getListRepos" :key="idx" :repository="repo"
                        :style="{ '--d': `${.05 * (idx % 30)}s` }"
                    />
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import Project from '~/components/models/project/Card.vue';
import Repository from '~/components/models/project/Repository.vue';

import NavBar, { IButton } from '~/components/content/NavBar.vue';

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IProject, IRepository } from '~/types/api/project';
import { EPermissions } from '~/types/api/user';

import type { IScrollBar } from '~/components/content/ScrollBar.vue';
import type { IMessage } from '~/windows/Message.vue';

type Type = 'projects' | 'repos';

type Filters = {
    text: string;
    type: string;
    topics: Array<string>;
}

const { $api } = useNuxtApp();

const route = useRoute();

const   
    user = useUserStore(),
    notifications = useNotificationsStore(),
    windows = useWindowsStore(),
    config = useConfigStore();

const props = defineProps({
    login: { type: String, default: 'heitoke' },
    scrollProps: { type: Object as PropType<IScrollBar> }
});

const
    type = ref<Type>(route.params?.name as Type),
    filters = ref<Filters>({ text: '', type: 'name', topics: [] }),
    projects = ref<Array<IProject>>([]),
    repos = ref<Array<IRepository>>([]),
    loading = ref<boolean>(true),
    topics = ref<Array<IButton>>([{ label: 'All' }]);

const menu = {
    repos: [
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
    projects: [
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
}


const isAdmin = computed(() => user.getPer(EPermissions.Projects));

const getListProjects = computed(() => {
    let _projects = [...projects.value || []],
        type = filters.value.type;

    let sort = _projects.sort((a: any, b: any) => {
        if (type === 'name') return (a.name > b.name) as any;
        if (type === 'members') return (a.members.length < b.members.length) as any;
        if (type === 'date') return (a.createdAt > b.createdAt) as any;
    });

    let regex = new RegExp(filters.value.text.trim(), 'gi');

    return sort
        .filter(({ tags }) => hasTopics(tags || []))
        .filter(({ name, displayName, description }) => regex.test(name || '') || regex.test(displayName || '') || regex.test(description || ''));
});

const getListRepos = computed(() => {
    let _repos = [...repos.value || []],
        type = filters.value.type;

    let sort = _repos.sort((a: any, b: any) => {
        if (type === 'name') return (a.name > b.name) as any;
        if (type === 'stars') return (a.stargazers_count < b.stargazers_count) as any;
        if (type === 'watchers') return (a.watchers_count < b.watchers_count) as any;
        if (type === 'forks') return (a.forks_count < b.forks_count) as any;
    });

    let regex = new RegExp(filters.value.text.trim(), 'gi');

    return sort
        .filter(({ topics }) => hasTopics(topics))
        .filter(({ name, description, owner, language }) => regex.test(name) || regex.test(description) || regex.test(owner?.login) || regex.test(language));
});

const getReposId = computed(() => {
    return route.params.id;
});


watch(() => props.scrollProps?.scroll?.top!, (newValue: number) => {
    if ((newValue + 1) >= props.scrollProps?.scroll.max.height! && !loading.value && (repos.value?.length % 30) === 0) {
        let nextPage = (repos.value?.length / 30) + 1;

        loadRepos(nextPage);
    }
});

watch(type, (newValue) => {
    if (newValue === 'repos' && repos.value?.length < 1) {
        loadRepos();
    }
});

async function loadProjects() {
    loading.value = true;

    const [_projects, status] = await $api.projects.list();

    if (status !== 200) {
        notifications.error({
            title: 'loading projects',
            message: (projects as any)?.message,
            status: status
        });

        return loading.value = false;
    }

    for (let project of _projects?.results) {
        projects.value = [...projects.value || [], project];

        loadTopics(project?.tags || []);
    }

    loading.value = false;
}

async function loadRepos(page: number = 1) {
    loading.value = true;

    let res = await fetch(`https://api.github.com/users/${route.params.id || 'heitoke'}/repos?page=${page}`),
        _repos = await res.json() as Array<IRepository>;

    if (res.status !== 200) {
        notifications.error({
            title: 'loading repos',
            message: (repos as any)?.message,
            status: res.status
        });

        return loading.value = false;
    }

    for (let repo of _repos) {
        repos.value = [...repos.value || [], repo];

        loadTopics(repo.topics);
    }

    loading.value = false;
}

async function createProject() {
    const newProject = { name: '' };

    windows.create({
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
                    click: async (e: any, data: any, windowId: number) => {
                        const [project, status] = await $api.projects.create(newProject as any);

                        if (status !== 200) return notifications.error({
                            title: 'creating project',
                            message: (project as any)?.message,
                            status
                        });

                        notifications.push({
                            title: 'New project',
                            message: `Project ${project.name} was successfully created`,
                            icon: 'image',
                            color: 'var(--green)'
                        });

                        projects.value = [];
                        loadProjects();

                        windows.close(windowId);
                    }
                }
            ]
        } as IMessage
    })
}

function loadTopics(array: Array<string>) {
    for (let topic of array) {
        if (!topics.value?.find(t => t.label === topic)) {
            topics.value = [...topics.value || [], {
                label: topic,
                icon: 'tag',
                color: colors.stringToHexColor(topic)
            }];
        }
    }

    topics.value = topics.value.sort((a, b) => a.label > b.label ? 1 : 0);
}

function hasTopics(listTopics: Array<string>) {
    const _topics = filters.value?.topics;

    if (_topics?.length < 1) return true;

    return _topics?.find(topic => listTopics?.find(t => t === topic));
}

function selectTopic(topic: string) {
    if (topic === 'All') {
        filters.value.topics = [];
    } else {
        const _topics = filters.value.topics;

        filters.value.topics = _topics?.includes(topic) ? _topics.filter(t => t !== topic) : [..._topics || [], topic];
    }
}


onMounted(() => {
    switch(type.value) {
        case 'repos':
            loadRepos();
            break;
        default:
            loadProjects();
            break;
    }
});


useSeoMeta({
    title: type.value === 'repos' ? 'Repositories' + (getReposId.value ? ` (${getReposId.value})` : '') : 'Projects'
});


definePageMeta({
    path: '/:name(projects|repos)',
    alias: [
        '/:name(repos)/:id'
    ]
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
    margin: 32px 0 0 0;
    padding: 0 10%;
    width: 100%;
    height: auto;
    min-height: 100%;
    align-items: flex-start;

    .nav-bar.menu {
        margin: 0 12px 0 0;
        max-width: 196px;
        min-width: 196px;

        & + div {
            width: calc(100% - 196px);
        }
    }

    .filters {
        display: flex;
        align-items: center;

        .ui-select {
            margin: 0 12px;
        }

        .ui-button {
            width: 96px;
        }
    }

    .nav-bar.topics {
        margin: 12px 0;
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

        .nav-bar.menu {
            margin: 0 0 16px 0;
            min-width: 100%;
        
            & + div {
                width: 100%;
            }
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