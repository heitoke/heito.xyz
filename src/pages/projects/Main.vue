<template>
    <div class="projects">
        <div class="grid">
            <Project v-for="(project, idx) in projects" :key="idx" :project="project"
                @click="createWindow({ title: `Project ${project.title}`, component: 'Project' });"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

import Project from '../../components/cards/Project.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions } from 'vuex';

export default defineComponent({
    name: 'ProjectsPage',
    components: {},
    computed: {},
    props: {},
    data: () => ({
        projects: [
            ...new Array(5).fill({
                title: 'Project',
                image: 'https://kartinkin.net/pics/uploads/posts/2022-08/1659385713_18-kartinkin-net-p-doski-piksel-art-oboi-20.jpg',
                description: 'Description',
                createdAt: Date.now()
            })
        ]
    }),
    watch: {},
    methods: {
        ...mapActions(['createWindow'])
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.page.projects {
    padding: 0 10vw;
    min-height: 100vh;

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 12px;
        row-gap: 12px;
    }
}

</style>