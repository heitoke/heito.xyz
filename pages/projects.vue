<template>
    <div class="projects">
        <NavBar class="menu"
            :orientation="'vertical'"

            :value="$route.path"
            :items="getMenuItems"

            @select="$router.push($event.value)"
        />

        <div class="filters">
            <Textbox :label="`Search`"
                :value="filters.text"

                @update="filters.text = $event"
            />

            <NavBar class="topics"
                :multi="true"
                :value="filters.selectedTopics"

                :items="getListTopics"

                @select-multi="filters.selectedTopics = $event.map(i => i.value)"
            />
        </div>

        <main>
            <div class="grid">
                <TransitionGroup name="projects">
                    <template v-if="$route.name === 'projects'">
                        Projects
                    </template>
    
                    <template v-else>
                        <RepositoryCard v-for="(repo, idx) of getListCards" :key="repo.id"
                            :style="{ '--d': `${.05 * (idx % 30)}s` }"

                            :repo="repo"
                        />
                    </template>
                </TransitionGroup>
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>

import RepositoryCard from '~/components/models/projects/Repository.vue';

import NavBar, { type Item } from '~/components/models/content/NavBar.vue';

import { useI18n } from 'vue-i18n';

import type { Repository } from '~/types/api/project';


const $route = useRoute();

const { t: $t } = useI18n();


const props = defineProps<{
    scroll: {
        value: number;
        max: number;
    }
}>();


const filters = ref({
    text: '',
    selectedTopics: [] as Array<string>,
    listAllTopics: [] as Array<string>
});

const
    isLoading = ref(false),
    projects = ref<Array<any>>([]),
    repos = ref<Array<Repository>>([]),
    isNext = ref(true);

const getMenuItems = ref<Array<Item>>([
    {
        label: $t('pages.projects.title'),
        icon: 'images',
        value: '/projects'
    },
    {
        label: $t('pages.repos.title'),
        icon: 'fork',
        value: '/repos'
    }
]);

const selectSortItems = {
    projects: [],
    repos: []
}


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

const getListCards = computed(() => {
    const { text, selectedTopics } = filters.value;

    const regex = new RegExp(text.trim(), 'gi');

    if ($route.name === 'projects') {
        return [];
    }

    return repos.value
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
        fetchListRepositories($route.query.login as string);

        timer = false;

        setTimeout(() => {
            timer = true
        }, 500);
    }
});


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


onMounted(() => {
    if ($route.name === 'projects') {

    } else {
        fetchListRepositories($route.query.login as string);
    }
});


definePageMeta({
    pageOptions: {
        padding: '0 10%',
        name: 'projects',
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
        margin-right: 12px;
        grid-area: menu;
    }

    .filters {
        margin-left: 12px;
        grid-area: filters;

        .topics {
            margin: 12px 0;
        }
    }

    main {
        margin-left: 12px;
        grid-area: main;

        .grid {
            display: grid;
            width: 100%;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: 12px;
            row-gap: 12px;
        }
    }
}

</style>