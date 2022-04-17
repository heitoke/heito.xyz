<template>
    <div class="projects">
        <div class="block">
            <div class="bar">
                <Button text="Add new project" color="green" style="font-size: 12px;" @click="add()" v-if="getRole && type === 'projects'"/>
                <Select :items="buttons" :value="$route.query?.type || 'projects'" @onEvent="load($event.value)"/>
                <Text :text="`Search ${type === 'repos' ? 'repositories' : 'projects'}`" @onEvent="text = $event"/>
            </div>
            <ul class="tags">
                <ul class="tags" v-if="tags.length > 0">
                    <li v-for="tag of tags" :key="tag"
                        :class="{ active: type === tag }"
                        @click="type = type === tag ? '' : tag"
                    >
                        <i class="uil uil-tag-alt"></i>
                        <span>{{ tag }}</span>
                    </li>
                </ul>
            </ul>
            <ul class="list" v-if="list && type === 'projects'">
                <ProjectCard v-for="project of list?.filter(item => new RegExp(text, 'i').test(item.title))" :key="project" :data="project"/>
            </ul>
            <ul class="list" v-if="list && type === 'repos'">
                <ProjectRepo v-for="repo of list?.filter(item => new RegExp(text, 'i').test(item.name))" :key="repo" :data="repo"/>
            </ul>
            <Button text="Load more" @click="load(type, page + 1)" style="margin: 16px 0;" v-if="type === 'repos' && list?.length === (page * 100)"/>
        </div>
    </div>
</template>

<script>

import ProjectCard from '../components/project/card.vue'
import ProjectRepo from '../components/project/repo.vue'

export default {
    name: 'ProjectsPage',
    components: { ProjectCard, ProjectRepo },
    computed: {},
    data() {
        return {
            text: '',
            tags: [],
            list: null,
            type: 'projects',
            page: 0,
            login: 'bobiclaki',
            buttons: [
                { label: 'Projects', icon: 'uil uil-folder', value: 'projects', color: 'var(--C1)' },
                { label: 'Repositories', icon: 'uil uil-postcard', value: 'repos', color: 'var(--C6)' }
            ]
        }
    },
    methods: {
        async load(type, page = 1) {
            if (type === 'projects') this.list = await this.fetch(`/projects?token=${this.getLocal?.token}`);
            else if (type === 'repos') {
                let list = await this.fetch(`/projects/repos?login=${this.login}&page=${page}`);
                this.list = page > 1 ? [...this.list, ...list] : list;
            }
            this.type = type;
            this.page++;
            this.router(`/projects?type=${type}`)
        },
        async add() {
            let { status } = await this.fetch('/projects/add', { token: this.getLocal?.token, data: { title: 'New Project' } });
            if (status !== 200) return;
            this.load();
        }
    },
    mounted() {
        this.login = this.$route.query?.login || this.login;
        let type = this.buttons.find(item => item.value === this.$route.query?.type);
        this.load(type ? type?.value : 'projects');
    }
}
</script>

<style lang="scss">

.page.projects .block {
    margin: 16px auto 0 auto;
    max-width: 940px;

    .bar {
        display: flex;
        align-items: center;

        .field-button {
            margin: 0 12px 0 0;
            white-space: nowrap;
        }

        .field-select {
            margin: 0 12px 0 0;
            min-width: 156px;

            div {
                padding: 8px 24px;
            }
        }
    }

    .list {
        display: grid;
        align-items: flex-start;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
}

@media (max-width: 540px) {
    .page.projects .block {
        max-width: 95%;

        .list {
            grid-template-columns: 1fr;
        }
    }
}

@media (max-width: 360px) {
    .page.projects .block {
        .bar {
            flex-direction: column;

            .field-button {
                margin: 0 0 12px 0;
                width: 90%;
            }

            .field-select {
                margin: 0 0 12px 0;
                width: 100%;
            }
        }
    }
}

</style>