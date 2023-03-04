<template>
    <div class="projects">
        <Project :project="{
            title: 'Project',
            image: 'https://kartinkin.net/pics/uploads/posts/2022-08/1659385713_18-kartinkin-net-p-doski-piksel-art-oboi-20.jpg',
            description: 'Description',
            createdAt: Date.now()
        }"/>
        <RouterLink to="/projects/78543">Project</RouterLink>
    </div>
</template>

<script lang="ts" setup>

import Project from '../../components/cards/Project.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ProjectsPage',
    components: {},
    computed: {},
    props: {},
    data: () => ({}),
    watch: {},
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

.page.projects {
    padding: 0 10vw;
    min-height: 100vh;
}

</style>