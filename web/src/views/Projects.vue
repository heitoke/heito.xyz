<template>
    <div class="projects">
        <div class="block">
            <div class="bar">
                <Button text="Add new project" color="green" style="font-size: 12px;" @click="add()"/>
                <Text text="Search projects"/>
            </div>
            <ul class="tags">
                <ul class="tags" v-if="tags.length > 0">
                    <li v-for="tag of new Array(10).fill('test')" :key="tag"
                        :class="{ active: type === tag }"
                        @click="type = type === tag ? '' : tag"
                    >
                        <i class="uil uil-tag-alt"></i>
                        <span>{{ tag }}</span>
                    </li>
                </ul>
            </ul>
            <ul class="list">
                <ProjectCard v-for="project of projects" :key="project" :data="project"/>
            </ul>
        </div>
    </div>
</template>

<script>

import ProjectCard from '../components/project/card.vue'

export default {
    name: 'ProjectsPage',
    components: { ProjectCard },
    computed: {},
    data() {
        return {
            tags: [
                'test',
                'test1'
            ],
            projects: null
        }
    },
    methods: {
        async load() {
            let list = await this.fetch(`/projects?token=${this.getLocal?.token}`);
            this.projects = list;
        },
        async add() {
            let { status } = await this.fetch('/projects/add', { token: this.getLocal?.token, data: { title: 'New Project' } });
            if (status !== 200) return;
            this.load();
        }
    },
    mounted() {
        this.load();
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
    }

    .list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
}

</style>