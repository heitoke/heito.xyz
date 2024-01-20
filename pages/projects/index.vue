<template>
    <div class="projects">
        <NavBar class="menu"
            :orientation="'vertical'"

            :value="$route.path"
            :items="getMenuItems"

            @select="$router.push($event.value)"
        />

        <div class="filters">
            <div>
                <Textbox :label="`Search`"
                    :value="filters.text"

                    @update="filters.text = $event"
                />

                <Select label="Sort by"
                    :value="filters.type"

                    :options="selectSortItems[isProjectPage ? 'projects' : 'repos']"

                    @select="filters.type = $event.value"
                />

                <Button label="Create" v-if="isProjectPage && $user.has(['projects'])"
                    color="var(--green)"

                    @click="createNewProject"
                />
            </div>

            <NavBar class="topics" v-show="filters.listAllTopics.length > 0"
                :multi="true"
                :value="filters.selectedTopics"

                :items="getListTopics"

                @select-multi="filters.selectedTopics = $event.map(i => i.value)"
            />
        </div>

        <main>
            <div class="grid">
                <TransitionGroup name="projects">
                    <template v-if="isProjectPage">
                        <ProjectCard v-for="(project, idx) of (getListCards as Array<Project>)" :key="project._id"
                            :style="{ '--d': `${.05 * (idx % 30)}s` }"

                            :project="project"

                            @click="$router.push(`/projects/${project?.name || project?._id}`)"
                        />
                    </template>
    
                    <template v-else>
                        <RepositoryCard v-for="(repo, idx) of (getListCards as Array<Repository>)" :key="repo.id"
                            :style="{ '--d': `${.05 * (idx % 30)}s` }"

                            :repo="repo"
                        />
                    </template>
                </TransitionGroup>
            </div>

            <Loading v-if="isLoading" style="margin-top: 12px;"/>
        </main>
    </div>
</template>

<script lang="ts" setup>

import ProjectCard from '~/components/models/projects/Card.vue';
import RepositoryCard from '~/components/models/projects/Repository.vue';

import NavBar, { type Item } from '~/components/models/content/NavBar.vue';

import { useI18n } from 'vue-i18n';

import type { Project, Repository } from '~/types/api/project';


const { $api } = useNuxtApp();

const $route = useRoute();

const { t: $t } = useI18n();


const
    $user = useUserStore(),
    $windows = useWindowsStore();


const props = defineProps<{
    scroll: {
        value: number;
        max: number;
    }
}>();


const filters = ref({
    text: '',
    type: '',
    order: false,
    selectedTopics: [] as Array<string>,
    listAllTopics: [] as Array<string>
});

const
    isLoading = ref(false),
    projects = ref<Array<Project>>([]),
    repos = ref<Array<Repository>>([]),
    isNext = ref(true);


const isProjectPage = computed(() => {
    return $route.path.includes('project');
});

const getMenuItems = computed<Array<Item>>(() => [
    {
        label: $t('pages.projects.title'),
        icon: 'images',
        color: 'var(--blue)',
        value: '/projects'
    },
    {
        label: $t('pages.repos.title'),
        icon: 'fork',
        color: 'var(--orange)',
        value: '/repos'
    }
]);

const selectSortItems = computed<{ [key: string]: Array<Item> }>(() => {
    const itemByName: Item = {
        label: 'by Name',
        icon: 'search-alt',
        value: 'name'
    };
    
    return {
        projects: [
            itemByName
        ],
        repos: [
            itemByName,
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
        ]
    }
});

const getListTopics = computed<Array<Item>>(() => {
    const list = filters.value.listAllTopics;

    if (!list?.length) return [];

    return [
        {
            label: 'All',
            clear: true,
            value: 'all'
        },
        ...list.map(t => ({
            icon: 'tag',
            color: colors.stringToHexColor(t),
            value: t
        }))
    ]
});

const sortBy = (is: boolean) => {
    const { order } = filters.value;

    return is ? (1 * (order ? -1 : 1)) : (1 * (order ? 1 : -1));
}

const getListCards = computed<Array<Repository> | Array<Project>>(() => {
    const { text, type, selectedTopics } = filters.value;

    const regex = new RegExp(text.trim(), 'gi');

    if (isProjectPage.value) {
        return projects.value;
    }

    return repos.value
        .sort((a, b) => {
            switch(type) {
                case 'name':
                    return sortBy(a.name > b.name);
                    break;
                case 'stars':
                    return sortBy(a.stargazers_count > b.stargazers_count);
                    break;
                case 'watchers':
                    return sortBy(a.watchers_count > b.watchers_count);
                    break;
                case 'forks':
                    return sortBy(a.forks_count > b.forks_count);
                    break;
                default:
                    return 1;
                    break;
            }
        })
        .filter(({ topics }) => {
            if (selectedTopics.length < 1) return true;

            return selectedTopics.find(t => topics.includes(t));
        })
        .filter(({ name, description, owner, language }) => {
            return regex.test(name)
                || regex.test(description)
                || regex.test(owner?.login)
                || regex.test(language);
        });
});


let timer = true;

watch(() => props.scroll.value, newValue => {
    if (!timer) return;

    if (newValue >= props.scroll.max - 100) {
        if (isProjectPage.value) {

        } else {
            fetchListRepositories($route.query.login as string);
        }

        timer = false;

        setTimeout(() => {
            timer = true
        }, 500);
    }
});


async function fetchListProjects() {
    isLoading.value = true;

    const { ok, data } = await $api.projects.list();

    isLoading.value = false;

    if (!ok) return;

    projects.value = data.results;
}

async function fetchListRepositories(login: string = 'heitoke') {
    if (!isNext.value) return;

    isLoading.value = true;

    const count = repos.value.length;

    const page = count % 30 === 0 && isNext.value ? Math.floor(count / 30) + 1 : 1;

    // if (page === 1 && count > 30) return;

    const res = await fetch(`https://api.github.com/users/${login}/repos?page=${page}`);

    const listRepos = await res.json() as Array<Repository>;

    isLoading.value = false;

    if (res.status !== 200) return;

    repos.value = page === 1 ? listRepos : [...repos.value, ...listRepos];

    isNext.value = listRepos.length % 30 === 0;

    if (page === 1) filters.value.listAllTopics = [];

    for (let repo of listRepos) {
        filters.value.listAllTopics = [...new Set([...filters.value.listAllTopics, ...repo.topics])]
    }
}

function createNewProject() {
    const
        name = ref(''),
        displayName = ref('')

    const { id } = $windows.create('Message', {
        title: 'Create new project',
        icon: 'image',
        components: [
            {
                name: 'name',
                component: 'Textbox',
                props: {
                    label: 'Name',
                    value: name
                },
                style: {
                    'margin-top': '12px'
                },
                events: {
                    update(value: string) {
                        name.value = value;
                    }
                }
            },
            {
                name: 'displayName',
                component: 'Textbox',
                props: {
                    label: 'Display Name',
                    value: displayName
                },
                style: {
                    'margin-top': '12px'
                },
                events: {
                    update(value: string) {
                        displayName.value = value;
                    }
                }
            },
            {
                name: 'button',
                component: 'Button',
                props: {
                    label: 'Create',
                    color: 'var(--green)'
                },
                style: {
                    width: '100%',
                    'margin-top': '12px'
                },
                events: {
                    click: async () => {
                        const { ok, data } = await $api.projects.create(name.value, displayName.value);

                        if (!ok) return;

                        console.log(data);
                        
                        projects.value = [data, ...projects.value];

                        $windows.close(id);
                    }
                }
            }
        ]
    });
}


onMounted(() => {
    if (isProjectPage.value) {
        fetchListProjects();
    } else {
        fetchListRepositories($route.query.login as string);
    }
});


definePageMeta({
    pageOptions: {
        padding: '0 10%',
        name: 'projects',
        icon: 'images',
        index: 1
    }
});

</script>

<style lang="scss" scoped>

.projects-enter-active,
.projects-leave-active {
    transform: scale(.9);
    transition: all .5s;
    transition-delay: var(--d, 0s);
    opacity: 0;
}

.page.projects {
    display: grid;
    padding: 0 10%;
    position: relative;
    grid-template-columns: 196px calc(100% - 196px - 12px);
    grid-template-areas: 'menu filters'
                         'menu main';
    align-content: flex-start;

    .menu {
        grid-area: menu;
    }

    .filters,
    main {
        margin-left: 12px;
        width: 100%;
    }

    .filters {
        grid-area: filters;

        & > div:nth-child(1) {
            display: flex;

            .ui-textbox {
                margin-right: 12px;
                width: 100%;
            }

            .ui-select {
                width: auto;
                min-width: 196px;
            }
            
            .ui-button {
                margin-left: 12px;
                min-width: max-content;
            }
        }

        .topics {
            margin-top: 12px;
        }
    }

    main {
        margin-top: 12px;
        grid-area: main;

        .grid {
            display: grid;
            width: 100%;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            column-gap: 12px;
            row-gap: 12px;
        }
    }
}

@media (max-width: 640px) {
    .page.projects {
        display: block;

        .filters {
            margin: 0;
        }

        main {
            margin: 12px 0 0 0;
        }
    }
}

</style>