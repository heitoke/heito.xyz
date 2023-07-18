<template>
    <div class="search">
        <header>
            <div class="bar">
                <Textbox :label="'To find ' + menu.find(btn => btn.value === type)?.value"
                    :value="list[type].text"
                    :autofocus="true"
                    @input="list[type].text = $event.target?.value"
                />

                <Select label="Sort" :value="list[type].sort" :menu="sorts[type]"/>
            </div>

            <NavBar :menu="menu"
                @select="type = $event.value"
            />
        </header>

        <ScrollBar max-height="70vh">
            <div class="grid users" v-if="type === 'users'">
                <User v-for="user of list.users.list" :key="user._id"
                    :user="user"
                />
            </div>

            <div class="grid projects" v-if="type === 'projects'">
                <Project v-for="project of list.projects.list" :key="project._id"
                    :project="project"
                />
            </div>

            <div class="grid blogs" v-if="type === 'blogs'">
                <Blog v-for="blog of list.blogs.list" :key="blog._id"
                    :blog="blog"
                    @click="$router.push(`/blogs/${blog._id}`); windows.close(windowId!)"
                />
            </div>
        </ScrollBar>

        <Loading v-if="loading"/>

        <Alert type="mini" v-else-if="!loading && list[type].list.length < 1"/>
    </div>
</template>

<script lang="ts" setup>

import NavBar, { type IButton } from '~/components/content/NavBar.vue';

import ScrollBar from '~/components/content/ScrollBar.vue';

import User from '~/components/models/user/Card.vue';
import Project from '~/components/models/project/Card.vue';
import Blog from '~/components/models/blogs/Card.vue';

import type { IUser } from '~/types/api/user';
import type { IProject } from '~/types/api/project';
import type { IBlog } from '~/types/api/blog';

type Type = 'users' | 'projects' | 'blogs';

interface List<V> {
    text: string;
    list: Array<V>;
    sort: 'name' | 'date';
}

interface ListSearch {
    users: List<IUser>;
    projects: List<IProject>;
    blogs: List<IBlog>;
}


const { $api } = useNuxtApp();

const windows = useWindowsStore();

const props = defineProps({
    windowId: { type: Number }
});

const
    type = ref<Type>('users'),
    loading = ref<boolean>(false);

const
    list = ref<ListSearch>({
        users: { text: '', list: [], sort: 'name' },
        projects: { text: '', list: [], sort: 'name' },
        blogs: { text: '', list: [], sort: 'name' }
    });

const menu: Array<IButton> = [
    {
        label: 'Users',
        icon: 'users',
        value: 'users'
    },
    {
        label: 'Projects',
        icon: 'images',
        value: 'projects'
    },
    {
        label: 'Blogs',
        icon: 'quill',
        value: 'blogs'
    }
];

const
    sortName = {
        label: 'by Name',
        icon: 'search-alt',
        value: 'name'
    },
    sortDate = {
        label: 'by Date',
        icon: 'clock',
        value: 'date'
    };

const sorts = {
    users: [
        sortName,
        sortDate
    ],
    projects: [
        sortName,
        sortDate
    ],
    blogs: [
        sortName,
        sortDate
    ]
}


let timer: NodeJS.Timeout;

watch(() => list.value[type.value].text, (newValue, oldValue) => {
    if (!newValue) return clearTimeout(timer);
    
    clearTimeout(timer);

    timer = setTimeout(() => {
        loading.value = true;

        switch(type.value) {
            case 'users':
                searchUsers();
                break;
            case 'projects':
                searchProjects();
                break;
            case 'blogs':
                searchBlogs();
                break;
        }
    }, 1000);
});


async function searchUsers() {
    const { text, sort } = list.value.users;

    const [result, status] = await $api.users.list({ text, sort });

    if (status !== 200) return;

    list.value.users.list = result.results;
    
    loading.value = false;
}

async function searchProjects() {
    const { text, sort } = list.value.users;

    const [result, status] = await $api.projects.list({ text, sort });

    if (status !== 200) return;

    list.value.projects.list = result.results;

    loading.value = false;
}

async function searchBlogs() {
    const { text, sort } = list.value.users;

    const [result, status] = await $api.blogs.list({ text, sort });

    if (status !== 200) return;

    list.value.blogs.list = result.results;

    loading.value = false;
}

</script>

<style lang="scss" scoped>

.block.search {
    max-width: 512px;
    min-width: 512px;
    position: relative;

    header {
        .bar {
            display: flex;

            .ui-textbox {
                margin: 0 12px 0 0;
            }

            .ui-select {
                min-width: 96px;
            }
        }

        .nav-bar {
            margin: 0 0 8px 0;
            padding: 8px 0;
            border-bottom: 1px solid var(--background-secondary);
        }
    }

    .grid.users {
        display: grid;
        grid-template-columns: repeat(2, 50%);

        div {
            max-width: calc(100% - 6px);

            &:nth-child(1n) {
                margin: 12px 6px 0 0;
            }
            &:nth-child(2n) {
                margin: 12px 0 0 6px;
            }

            &:nth-child(1) {
                margin: 0 6px 0 0;   
            }
            &:nth-child(2) {
                margin: 0 0 0 6px;   
            }
        }
    }

    .grid.projects,
    .grid.blogs {
        div {
            margin: 0 0 12px 0;

            &:last-child {
                margin: 0;
            }
        }
    }


    @media (max-width: 540px) {
        min-width: auto;
        .grid {
            display: block !important;

            div {
                margin: 0 0 12px 0 !important;
                max-width: 100% !important;

                &:last-child {
                    margin: 0 !important;
                }
            }
        }
    }
}

</style>