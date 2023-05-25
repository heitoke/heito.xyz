<template>
    <div class="repository">
        <header>
            <div class="avatar" :style="{ 'background-image': `url(${repository?.owner?.avatar_url})` }"></div>
            <span @click.passive.self="redirect(repository?.owner?.html_url!)">{{ repository?.owner.login }}</span>
            /
            <span @click.passive.self="redirect(repository?.html_url!)">{{ repository?.name }}</span>

            <div style="margin: 0 0 0 auto;"></div>

            <Icon name="link" v-show="repository?.homepage" style="margin: 0 8px 0 0;"
                @mouseenter="setToolpic({ title: repository?.homepage?.replace(/http(s)?:\/\//g, ''), text: 'Link' })"
                @click="redirect(repository?.homepage!)"
            />

            <Icon name="star-alt" v-show="repository?.stargazers_count! > 0" style="margin: 0 8px 0 0;"
                @mouseenter="setToolpic({ title: repository?.stargazers_count, text: 'Stars' })"
            />

            <Icon name="eye" v-show="repository?.watchers_count! > 0" style="margin: 0 8px 0 0;"
                @mouseenter="setToolpic({ title: repository?.watchers_count, text: 'Watchers' })"
            />

            <Icon name="fork" v-show="repository?.forks_count! > 0" style="margin: 0 8px 0 0;"
                @mouseenter="setToolpic({ title: repository?.forks_count, text: 'Forks' })"
            />

            <div class="lang" v-show="repository?.language"
                :style="{ 'background-image': `url(https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/${repository?.language?.toLocaleLowerCase()}.svg)` }"
                @mouseenter="setToolpic({ title: repository?.language })"
            ></div>
        </header>
        
        <div class="text">{{ repository?.description! }}</div>

        <div style="margin: auto 0 0 0;"></div>

        <ul class="topics" v-show="repository?.topics?.length! > 0">
            <li v-for="topic of repository?.topics" :key="topic">
                {{ topic }}
            </li>
        </ul>

        <footer>
            <div class="created-at">created {{ time.format(repository?.created_at) }}</div>
        </footer>
    </div>
</template>

<script setup lang="ts">

import { time } from '../../libs/utils';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { mapActions } from 'vuex';

export interface IRepository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        html_url: string;
        type: string;
        site_admin: boolean;
    };
    html_url: string;
    description: string;
    fork: boolean;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    clone_url: string;
    homepage: string;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_discussions: boolean;
    forks_count: number;
    mirror_url: string | null,
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license: string | null;
    allow_forking: boolean;
    is_template: boolean;
    web_commit_signoff_required: boolean;
    topics: string[];
    visibility: string;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
}

export default defineComponent({
    name: 'CardRepository',
    computed: {},
    props: {
        repository: {
            type: Object as PropType<IRepository>
        }
    },
    data: () => ({}),
    methods: {
        ...mapActions(['setToolpic', 'setContextMenu']),
        redirect(url: string) {
            window.open(url, '');
        }
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.repository {
    display: flex;
    // padding: 12px 0;
    min-width: 100%;
    min-height: 196px;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    transition: .2s;

    &:hover {
        box-shadow: 0 0 0 2px var(--background-secondary);
    }

    header {
        display: flex;
        padding: 12px;
        border-bottom: 1px solid var(--background-secondary);
        align-items: center;

        .avatar {
            margin: 0 8px 0 0;
            min-width: 24px;
            height: 24px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            background-color: var(--background-secondary);
        }

        span {
            cursor: pointer;
            
            &:hover {
                text-decoration: underline;
            }

            &:last-of-type {
                max-width: 100%;
                margin: 0 12px 0 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }

        .hx-icon.i-open-link {
            cursor: pointer;
            margin: 0 8px 0 0;
            background-color: var(--text-secondary);

            &:hover {
                background-color: var(--text-primary);
            }
        }

        .lang {
            width: 24px;
            height: 24px;
            background-size: cover;
            background-position: center;
        }

        *:last-child {
            margin: 0;
        }
    }

    .text {
        display: -webkit-box;
        padding: 12px;
        height: 24px;
        color: var(--text-secondary);
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .topics {
        display: flex;
        padding: 8px 12px;
        border-top: 1px solid var(--background-secondary);
        align-items: center;
        overflow-y: hidden;

        &::-webkit-scrollbar {
            display: none;
        }

        li {
            margin: 0 8px 0 0;
            padding: 4px 8px;
            white-space: nowrap;
            border-radius: 5px;
            background-color: var(--background-secondary);

            &:last-child {
                margin: 0;
            }
        }
    }

    footer {
        padding: 12px;
        border-top: 1px solid var(--background-secondary);

        .created-at {
            color: var(--text-secondary);
            font-size: 12px;
        }
    }
}

</style>