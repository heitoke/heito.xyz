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


let rs: Array<any> = [
  {
    "id": 560171449,
    "node_id": "R_kgDOIWOJuQ",
    "name": "cubes",
    "full_name": "heitoke/cubes",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/cubes",
    "description": null,
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/cubes",
    "forks_url": "https://api.github.com/repos/heitoke/cubes/forks",
    "keys_url": "https://api.github.com/repos/heitoke/cubes/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/cubes/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/cubes/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/cubes/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/cubes/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/cubes/events",
    "assignees_url": "https://api.github.com/repos/heitoke/cubes/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/cubes/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/cubes/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/cubes/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/cubes/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/cubes/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/cubes/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/cubes/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/cubes/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/cubes/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/cubes/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/cubes/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/cubes/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/cubes/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/cubes/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/cubes/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/cubes/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/cubes/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/cubes/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/cubes/merges",
    "archive_url": "https://api.github.com/repos/heitoke/cubes/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/cubes/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/cubes/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/cubes/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/cubes/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/cubes/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/cubes/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/cubes/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/cubes/deployments",
    "created_at": "2022-10-31T22:17:35Z",
    "updated_at": "2022-11-01T10:53:46Z",
    "pushed_at": "2022-11-03T06:59:47Z",
    "git_url": "git://github.com/heitoke/cubes.git",
    "ssh_url": "git@github.com:heitoke/cubes.git",
    "clone_url": "https://github.com/heitoke/cubes.git",
    "svn_url": "https://github.com/heitoke/cubes",
    "homepage": null,
    "size": 819,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "C#",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [

    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "dev"
  },
  {
    "id": 424591194,
    "node_id": "R_kgDOGU6_Wg",
    "name": "heito.xyz",
    "full_name": "heitoke/heito.xyz",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/heito.xyz",
    "description": "My little personal website that exists simply because it can.",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/heito.xyz",
    "forks_url": "https://api.github.com/repos/heitoke/heito.xyz/forks",
    "keys_url": "https://api.github.com/repos/heitoke/heito.xyz/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/heito.xyz/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/heito.xyz/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/heito.xyz/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/heito.xyz/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/heito.xyz/events",
    "assignees_url": "https://api.github.com/repos/heitoke/heito.xyz/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/heito.xyz/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/heito.xyz/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/heito.xyz/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/heito.xyz/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/heito.xyz/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/heito.xyz/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/heito.xyz/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/heito.xyz/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/heito.xyz/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/heito.xyz/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/heito.xyz/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/heito.xyz/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/heito.xyz/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/heito.xyz/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/heito.xyz/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/heito.xyz/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/heito.xyz/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/heito.xyz/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/heito.xyz/merges",
    "archive_url": "https://api.github.com/repos/heitoke/heito.xyz/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/heito.xyz/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/heito.xyz/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/heito.xyz/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/heito.xyz/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/heito.xyz/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/heito.xyz/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/heito.xyz/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/heito.xyz/deployments",
    "created_at": "2021-11-04T12:41:38Z",
    "updated_at": "2023-08-16T16:14:53Z",
    "pushed_at": "2024-01-04T22:01:23Z",
    "git_url": "git://github.com/heitoke/heito.xyz.git",
    "ssh_url": "git@github.com:heitoke/heito.xyz.git",
    "clone_url": "https://github.com/heitoke/heito.xyz.git",
    "svn_url": "https://github.com/heitoke/heito.xyz",
    "homepage": "https://heito.xyz",
    "size": 30570,
    "stargazers_count": 5,
    "watchers_count": 5,
    "language": "Vue",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": true,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [
      "express",
      "i18n",
      "nodejs",
      "nuxt",
      "pinia",
      "plugins",
      "scss",
      "socket-io",
      "ssr",
      "threejs",
      "typescript",
      "vite",
      "vue3",
      "vuejs",
      "vuex"
    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 5,
    "default_branch": "mango"
  },
  {
    "id": 330729928,
    "node_id": "MDEwOlJlcG9zaXRvcnkzMzA3Mjk5Mjg=",
    "name": "heitoke",
    "full_name": "heitoke/heitoke",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/heitoke",
    "description": "?",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/heitoke",
    "forks_url": "https://api.github.com/repos/heitoke/heitoke/forks",
    "keys_url": "https://api.github.com/repos/heitoke/heitoke/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/heitoke/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/heitoke/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/heitoke/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/heitoke/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/heitoke/events",
    "assignees_url": "https://api.github.com/repos/heitoke/heitoke/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/heitoke/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/heitoke/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/heitoke/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/heitoke/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/heitoke/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/heitoke/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/heitoke/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/heitoke/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/heitoke/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/heitoke/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/heitoke/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/heitoke/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/heitoke/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/heitoke/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/heitoke/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/heitoke/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/heitoke/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/heitoke/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/heitoke/merges",
    "archive_url": "https://api.github.com/repos/heitoke/heitoke/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/heitoke/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/heitoke/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/heitoke/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/heitoke/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/heitoke/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/heitoke/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/heitoke/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/heitoke/deployments",
    "created_at": "2021-01-18T16:49:52Z",
    "updated_at": "2023-05-13T16:35:19Z",
    "pushed_at": "2023-06-30T14:30:43Z",
    "git_url": "git://github.com/heitoke/heitoke.git",
    "ssh_url": "git@github.com:heitoke/heitoke.git",
    "clone_url": "https://github.com/heitoke/heitoke.git",
    "svn_url": "https://github.com/heitoke/heitoke",
    "homepage": "https://heito.xyz",
    "size": 158,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": false,
    "has_projects": false,
    "has_downloads": true,
    "has_wiki": false,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [
      "heito",
      "me"
    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "main"
  },
  {
    "id": 629961773,
    "node_id": "R_kgDOJYx0LQ",
    "name": "hoshi",
    "full_name": "heitoke/hoshi",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/hoshi",
    "description": "Discord bot",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/hoshi",
    "forks_url": "https://api.github.com/repos/heitoke/hoshi/forks",
    "keys_url": "https://api.github.com/repos/heitoke/hoshi/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/hoshi/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/hoshi/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/hoshi/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/hoshi/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/hoshi/events",
    "assignees_url": "https://api.github.com/repos/heitoke/hoshi/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/hoshi/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/hoshi/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/hoshi/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/hoshi/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/hoshi/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/hoshi/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/hoshi/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/hoshi/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/hoshi/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/hoshi/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/hoshi/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/hoshi/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/hoshi/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/hoshi/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/hoshi/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/hoshi/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/hoshi/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/hoshi/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/hoshi/merges",
    "archive_url": "https://api.github.com/repos/heitoke/hoshi/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/hoshi/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/hoshi/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/hoshi/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/hoshi/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/hoshi/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/hoshi/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/hoshi/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/hoshi/deployments",
    "created_at": "2023-04-19T11:35:02Z",
    "updated_at": "2023-05-13T16:30:26Z",
    "pushed_at": "2023-06-07T12:08:14Z",
    "git_url": "git://github.com/heitoke/hoshi.git",
    "ssh_url": "git@github.com:heitoke/hoshi.git",
    "clone_url": "https://github.com/heitoke/hoshi.git",
    "svn_url": "https://github.com/heitoke/hoshi",
    "homepage": "https://hoshi.heito.xyz",
    "size": 22,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "TypeScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [
      "bot",
      "discord",
      "discord-js",
      "express",
      "nodejs",
      "typescript"
    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "dev"
  },
  {
    "id": 422559604,
    "node_id": "R_kgDOGS-_dA",
    "name": "mini-calculator",
    "full_name": "heitoke/mini-calculator",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/mini-calculator",
    "description": "Mini Calculator",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/mini-calculator",
    "forks_url": "https://api.github.com/repos/heitoke/mini-calculator/forks",
    "keys_url": "https://api.github.com/repos/heitoke/mini-calculator/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/mini-calculator/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/mini-calculator/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/mini-calculator/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/mini-calculator/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/mini-calculator/events",
    "assignees_url": "https://api.github.com/repos/heitoke/mini-calculator/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/mini-calculator/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/mini-calculator/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/mini-calculator/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/mini-calculator/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/mini-calculator/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/mini-calculator/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/mini-calculator/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/mini-calculator/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/mini-calculator/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/mini-calculator/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/mini-calculator/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/mini-calculator/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/mini-calculator/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/mini-calculator/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/mini-calculator/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/mini-calculator/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/mini-calculator/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/mini-calculator/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/mini-calculator/merges",
    "archive_url": "https://api.github.com/repos/heitoke/mini-calculator/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/mini-calculator/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/mini-calculator/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/mini-calculator/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/mini-calculator/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/mini-calculator/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/mini-calculator/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/mini-calculator/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/mini-calculator/deployments",
    "created_at": "2021-10-29T12:05:01Z",
    "updated_at": "2021-10-29T12:15:05Z",
    "pushed_at": "2021-10-29T12:15:03Z",
    "git_url": "git://github.com/heitoke/mini-calculator.git",
    "ssh_url": "git@github.com:heitoke/mini-calculator.git",
    "clone_url": "https://github.com/heitoke/mini-calculator.git",
    "svn_url": "https://github.com/heitoke/mini-calculator",
    "homepage": "",
    "size": 2,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "JavaScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 1,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [
      "calculator",
      "javascript"
    ],
    "visibility": "public",
    "forks": 1,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "main"
  },
  {
    "id": 419000004,
    "node_id": "R_kgDOGPluxA",
    "name": "mini-chat",
    "full_name": "heitoke/mini-chat",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/mini-chat",
    "description": "Chat with your friends when you're sitting in Discord",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/mini-chat",
    "forks_url": "https://api.github.com/repos/heitoke/mini-chat/forks",
    "keys_url": "https://api.github.com/repos/heitoke/mini-chat/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/mini-chat/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/mini-chat/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/mini-chat/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/mini-chat/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/mini-chat/events",
    "assignees_url": "https://api.github.com/repos/heitoke/mini-chat/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/mini-chat/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/mini-chat/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/mini-chat/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/mini-chat/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/mini-chat/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/mini-chat/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/mini-chat/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/mini-chat/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/mini-chat/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/mini-chat/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/mini-chat/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/mini-chat/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/mini-chat/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/mini-chat/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/mini-chat/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/mini-chat/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/mini-chat/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/mini-chat/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/mini-chat/merges",
    "archive_url": "https://api.github.com/repos/heitoke/mini-chat/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/mini-chat/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/mini-chat/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/mini-chat/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/mini-chat/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/mini-chat/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/mini-chat/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/mini-chat/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/mini-chat/deployments",
    "created_at": "2021-10-19T16:12:56Z",
    "updated_at": "2021-10-19T16:58:49Z",
    "pushed_at": "2021-10-19T16:57:54Z",
    "git_url": "git://github.com/heitoke/mini-chat.git",
    "ssh_url": "git@github.com:heitoke/mini-chat.git",
    "clone_url": "https://github.com/heitoke/mini-chat.git",
    "svn_url": "https://github.com/heitoke/mini-chat",
    "homepage": "",
    "size": 3,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [
      "chat",
      "javascript",
      "nodejs",
      "socket-io"
    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "dev"
  },
  {
    "id": 417833052,
    "node_id": "R_kgDOGOegXA",
    "name": "MiniBrowser",
    "full_name": "heitoke/MiniBrowser",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/MiniBrowser",
    "description": "MiniBrowser in Electron.js",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/MiniBrowser",
    "forks_url": "https://api.github.com/repos/heitoke/MiniBrowser/forks",
    "keys_url": "https://api.github.com/repos/heitoke/MiniBrowser/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/MiniBrowser/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/MiniBrowser/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/MiniBrowser/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/MiniBrowser/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/MiniBrowser/events",
    "assignees_url": "https://api.github.com/repos/heitoke/MiniBrowser/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/MiniBrowser/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/MiniBrowser/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/MiniBrowser/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/MiniBrowser/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/MiniBrowser/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/MiniBrowser/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/MiniBrowser/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/MiniBrowser/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/MiniBrowser/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/MiniBrowser/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/MiniBrowser/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/MiniBrowser/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/MiniBrowser/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/MiniBrowser/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/MiniBrowser/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/MiniBrowser/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/MiniBrowser/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/MiniBrowser/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/MiniBrowser/merges",
    "archive_url": "https://api.github.com/repos/heitoke/MiniBrowser/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/MiniBrowser/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/MiniBrowser/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/MiniBrowser/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/MiniBrowser/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/MiniBrowser/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/MiniBrowser/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/MiniBrowser/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/MiniBrowser/deployments",
    "created_at": "2021-10-16T13:14:49Z",
    "updated_at": "2022-01-26T02:59:20Z",
    "pushed_at": "2021-10-16T13:31:52Z",
    "git_url": "git://github.com/heitoke/MiniBrowser.git",
    "ssh_url": "git@github.com:heitoke/MiniBrowser.git",
    "clone_url": "https://github.com/heitoke/MiniBrowser.git",
    "svn_url": "https://github.com/heitoke/MiniBrowser",
    "homepage": null,
    "size": 5,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "HTML",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [

    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "main"
  },
  {
    "id": 662107145,
    "node_id": "R_kgDOJ3b0CQ",
    "name": "nuxt-template",
    "full_name": "heitoke/nuxt-template",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/nuxt-template",
    "description": "This repository is only needed for testing the work of Nuxt",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/nuxt-template",
    "forks_url": "https://api.github.com/repos/heitoke/nuxt-template/forks",
    "keys_url": "https://api.github.com/repos/heitoke/nuxt-template/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/nuxt-template/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/nuxt-template/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/nuxt-template/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/nuxt-template/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/nuxt-template/events",
    "assignees_url": "https://api.github.com/repos/heitoke/nuxt-template/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/nuxt-template/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/nuxt-template/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/nuxt-template/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/nuxt-template/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/nuxt-template/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/nuxt-template/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/nuxt-template/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/nuxt-template/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/nuxt-template/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/nuxt-template/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/nuxt-template/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/nuxt-template/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/nuxt-template/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/nuxt-template/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/nuxt-template/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/nuxt-template/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/nuxt-template/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/nuxt-template/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/nuxt-template/merges",
    "archive_url": "https://api.github.com/repos/heitoke/nuxt-template/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/nuxt-template/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/nuxt-template/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/nuxt-template/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/nuxt-template/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/nuxt-template/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/nuxt-template/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/nuxt-template/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/nuxt-template/deployments",
    "created_at": "2023-07-04T11:19:46Z",
    "updated_at": "2023-07-04T14:39:02Z",
    "pushed_at": "2023-07-04T15:13:37Z",
    "git_url": "git://github.com/heitoke/nuxt-template.git",
    "ssh_url": "git@github.com:heitoke/nuxt-template.git",
    "clone_url": "https://github.com/heitoke/nuxt-template.git",
    "svn_url": "https://github.com/heitoke/nuxt-template",
    "homepage": "https://nuxt-heito.vercel.app",
    "size": 11,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "Vue",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [
      "nuxt",
      "pinia",
      "typescript",
      "vercel",
      "vue"
    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "dev"
  },
  {
    "id": 422830430,
    "node_id": "R_kgDOGTPhXg",
    "name": "spotify-authorization",
    "full_name": "heitoke/spotify-authorization",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/spotify-authorization",
    "description": "Spotify Authorization",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/spotify-authorization",
    "forks_url": "https://api.github.com/repos/heitoke/spotify-authorization/forks",
    "keys_url": "https://api.github.com/repos/heitoke/spotify-authorization/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/spotify-authorization/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/spotify-authorization/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/spotify-authorization/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/spotify-authorization/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/spotify-authorization/events",
    "assignees_url": "https://api.github.com/repos/heitoke/spotify-authorization/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/spotify-authorization/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/spotify-authorization/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/spotify-authorization/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/spotify-authorization/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/spotify-authorization/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/spotify-authorization/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/spotify-authorization/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/spotify-authorization/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/spotify-authorization/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/spotify-authorization/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/spotify-authorization/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/spotify-authorization/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/spotify-authorization/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/spotify-authorization/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/spotify-authorization/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/spotify-authorization/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/spotify-authorization/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/spotify-authorization/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/spotify-authorization/merges",
    "archive_url": "https://api.github.com/repos/heitoke/spotify-authorization/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/spotify-authorization/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/spotify-authorization/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/spotify-authorization/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/spotify-authorization/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/spotify-authorization/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/spotify-authorization/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/spotify-authorization/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/spotify-authorization/deployments",
    "created_at": "2021-10-30T08:52:48Z",
    "updated_at": "2023-03-14T07:12:04Z",
    "pushed_at": "2023-03-14T07:03:53Z",
    "git_url": "git://github.com/heitoke/spotify-authorization.git",
    "ssh_url": "git@github.com:heitoke/spotify-authorization.git",
    "clone_url": "https://github.com/heitoke/spotify-authorization.git",
    "svn_url": "https://github.com/heitoke/spotify-authorization",
    "homepage": "",
    "size": 5,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "JavaScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [
      "authorization",
      "express",
      "javascript",
      "nodejs",
      "spotify",
      "typescript"
    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "ts-dev"
  },
  {
    "id": 419391522,
    "node_id": "R_kgDOGP9oIg",
    "name": "TaskList",
    "full_name": "heitoke/TaskList",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/TaskList",
    "description": "There was a time and there is no time!",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/TaskList",
    "forks_url": "https://api.github.com/repos/heitoke/TaskList/forks",
    "keys_url": "https://api.github.com/repos/heitoke/TaskList/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/TaskList/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/TaskList/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/TaskList/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/TaskList/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/TaskList/events",
    "assignees_url": "https://api.github.com/repos/heitoke/TaskList/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/TaskList/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/TaskList/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/TaskList/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/TaskList/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/TaskList/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/TaskList/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/TaskList/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/TaskList/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/TaskList/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/TaskList/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/TaskList/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/TaskList/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/TaskList/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/TaskList/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/TaskList/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/TaskList/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/TaskList/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/TaskList/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/TaskList/merges",
    "archive_url": "https://api.github.com/repos/heitoke/TaskList/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/TaskList/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/TaskList/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/TaskList/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/TaskList/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/TaskList/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/TaskList/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/TaskList/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/TaskList/deployments",
    "created_at": "2021-10-20T15:38:53Z",
    "updated_at": "2023-05-13T16:55:01Z",
    "pushed_at": "2021-10-20T19:42:48Z",
    "git_url": "git://github.com/heitoke/TaskList.git",
    "ssh_url": "git@github.com:heitoke/TaskList.git",
    "clone_url": "https://github.com/heitoke/TaskList.git",
    "svn_url": "https://github.com/heitoke/TaskList",
    "homepage": "",
    "size": 11,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [
      "heroku",
      "javascript",
      "nodejs",
      "socket-io",
      "task",
      "tasks"
    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "dev"
  },
  {
    "id": 592918448,
    "node_id": "R_kgDOI1c3sA",
    "name": "vue-vite-ssr",
    "full_name": "heitoke/vue-vite-ssr",
    "private": false,
    "owner": {
      "login": "heitoke",
      "id": 39241501,
      "node_id": "MDQ6VXNlcjM5MjQxNTAx",
      "avatar_url": "https://avatars.githubusercontent.com/u/39241501?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/heitoke",
      "html_url": "https://github.com/heitoke",
      "followers_url": "https://api.github.com/users/heitoke/followers",
      "following_url": "https://api.github.com/users/heitoke/following{/other_user}",
      "gists_url": "https://api.github.com/users/heitoke/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/heitoke/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/heitoke/subscriptions",
      "organizations_url": "https://api.github.com/users/heitoke/orgs",
      "repos_url": "https://api.github.com/users/heitoke/repos",
      "events_url": "https://api.github.com/users/heitoke/events{/privacy}",
      "received_events_url": "https://api.github.com/users/heitoke/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/heitoke/vue-vite-ssr",
    "description": "Vite Vue TS SSR",
    "fork": false,
    "url": "https://api.github.com/repos/heitoke/vue-vite-ssr",
    "forks_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/forks",
    "keys_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/teams",
    "hooks_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/hooks",
    "issue_events_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/issues/events{/number}",
    "events_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/events",
    "assignees_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/assignees{/user}",
    "branches_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/branches{/branch}",
    "tags_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/tags",
    "blobs_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/languages",
    "stargazers_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/stargazers",
    "contributors_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/contributors",
    "subscribers_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/subscribers",
    "subscription_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/subscription",
    "commits_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/contents/{+path}",
    "compare_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/merges",
    "archive_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/downloads",
    "issues_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/issues{/number}",
    "pulls_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/labels{/name}",
    "releases_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/releases{/id}",
    "deployments_url": "https://api.github.com/repos/heitoke/vue-vite-ssr/deployments",
    "created_at": "2023-01-24T20:15:48Z",
    "updated_at": "2023-07-08T05:13:25Z",
    "pushed_at": "2023-07-03T12:05:33Z",
    "git_url": "git://github.com/heitoke/vue-vite-ssr.git",
    "ssh_url": "git@github.com:heitoke/vue-vite-ssr.git",
    "clone_url": "https://github.com/heitoke/vue-vite-ssr.git",
    "svn_url": "https://github.com/heitoke/vue-vite-ssr",
    "homepage": "https://vue-vite-ssr-heito.vercel.app",
    "size": 57,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "TypeScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [
      "express",
      "sass",
      "ssr",
      "typescript",
      "vite",
      "vue",
      "vue-router",
      "vuex"
    ],
    "visibility": "public",
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "dev-ts"
  }
]



onMounted(() => {
    if ($route.name === 'projects') {

    } else {
        fetchListRepositories($route.query.login as string);
        

        // repos.value = rs;

        // filters.value.listAllTopics = [];

        // for (let r of rs) {
        //     filters.value.listAllTopics = [...new Set([...filters.value.listAllTopics, ...r.topics])]
        // }
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