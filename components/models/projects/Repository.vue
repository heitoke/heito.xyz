<template>
    <div class="repository-card">
        <div class="header">
            <img class="avatar" :src="repo.owner.avatar_url" alt="Repo Owner Avatar">

            <NuxtLink :to="repo.owner.html_url">{{ repo.owner.login }}</NuxtLink>
            /
            <NuxtLink :to="repo.html_url">{{ repo.name }}</NuxtLink>

            <div style="margin-left: auto;"></div>

            <Icon v-for="icon of getListIcons" :key="icon.name"
                :name="icon.name"

                @mouseenter="$toolpic.show(icon.label)"
            />

            <img class="lang" v-if="Boolean(repo?.language)"
                :src="`https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/${getLangImage}.svg`"

                @mouseenter="$toolpic.show(repo.language)"
            />
        </div>

        <div class="text">{{ repo.description || '' }}</div>

        <div style="margin: auto 0 0 0;"></div>

        <ul class="topics" v-show="repo?.topics?.length! > 0">
            <li v-for="topic of repo?.topics" :key="topic">
                {{ topic }}
            </li>
        </ul>

        <div class="footer">
            <div class="created-at">Created {{ time.format(repo?.created_at) }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import type { Repository } from '~/types/api/project';
import { replaceImageLanguage } from '~/types/api/stats';


interface Icon {
    name: string;
    label: string;
}


const $toolpic = useToolpicStore();


const props = defineProps<{
    repo: Repository;
}>();


const getListIcons = computed(() => {
    const { 
        homepage = '',
        stargazers_count = 0,
        watchers_count = 0,
        forks_count = 0
    } = props.repo;

    const list: Array<Icon> = [];

    if (homepage) {
        list.push({
            name: 'link',
            label: 'Link'
        });
    }

    if (stargazers_count > 0) {
        list.push({
            name: 'star-alt',
            label: `Stars: ${stargazers_count}`
        });
    }

    if (watchers_count > 0) {
        list.push({
            name: 'eye',
            label: `Watchers: ${watchers_count}`
        });
    }

    if (forks_count > 0) {
        list.push({
            name: 'fork',
            label: `Forks: ${forks_count}`
        });
    }

    return list;
});

const getLangImage = computed(() => {
    const lang = props.repo?.language?.toLocaleLowerCase(); 

    return replaceImageLanguage[lang!] || lang;
});


</script>

<style lang="scss" scoped>

.repository-card {
    display: flex;
    min-width: 100%;
    min-height: 196px;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    transition: .2s;

    &:hover {
        border-color: var(--main-color-alt);
        box-shadow: 0 0 0 3px var(--background-secondary);
    }

    .header {
        display: flex;
        padding: 12px;
        border-bottom: 1px solid var(--background-secondary);
        align-items: center;

        img.avatar {
            margin-right: 8px;
            max-width: 24px;
            min-width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: var(--background-secondary);
            object-fit: cover;
            object-position: center;
        }

        a {
            cursor: pointer;
            color: var(--text-secondary);
            font-size: 14px;
            text-decoration: none;
            transition: .2s;
            
            &:hover {
                color: var(--text-primary);
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

        .ui-icon {
            font-size: 14px;

            &:not(:last-of-type) {
                margin-right: 8px;
            }

            &.i-link {
                cursor: pointer;
            }
        }

        img.lang {
            margin-left: 8px;
            width: 24px;
            height: 24px;
            background-size: cover;
            background-position: center;
        }
    }

    .text {
        display: -webkit-box;
        padding: 12px;
        height: 24px;
        color: var(--text-secondary);
        font-size: 14px;
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
            font-size: 12px;
            white-space: nowrap;
            border-radius: 5px;
            background-color: var(--background-secondary);

            &:last-child {
                margin: 0;
            }
        }
    }

    .footer {
        padding: 12px;
        border-top: 1px solid var(--background-secondary);

        .created-at {
            color: var(--text-secondary);
            font-size: 12px;
        }
    }
}

</style>