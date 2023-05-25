<template>
    <div class="project">
        <div class="image" :style="{ '--image': `url('${project.image}')` }">
            <div class="date">{{ time.format(project.createdAt, 'dd MMM YYYY') }}</div>
        </div>

        <header>
            <div class="title">{{ project.title }}</div>
            <div class="description">{{ project.description }}</div>
        </header>

        <NavBar style="margin: 12px 0;" :menu="[
            {
                label: 'Users',
                icon: 'arrow-right'
            },
            {
                label: 'Projects',
                icon: 'half-sun'
            },
            {
                label: 'Collections',
                icon: 'sun-moon'
            },
            {
                label: 'Minecraft',
                icon: 'settings'
            },
            {
                label: 'Notifications',
                icon: 'notification'
            }
        ]" @select="a = $event"/>

        {{ a }}
    </div>
</template>

<script lang="ts" setup>

import { time } from '../../libs/utils';

import NavBar from '../../components/content/NavBar.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions } from 'vuex';

export default defineComponent({
    name: 'WindowProfileProject',
    components: {},
    computed: {},
    props: {
        windowId: { type: Number },
        data: { type: String }
    },
    data: () => ({
        a: {},
        project: {
            image: 'https://kartinkin.net/pics/uploads/posts/2022-08/1659385713_18-kartinkin-net-p-doski-piksel-art-oboi-20.jpg',
            title: 'ProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProject',
            description: 'DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionv',
            createdAt: Date.now()
        }
    }),
    watch: {},
    methods: {
        ...mapActions(['setContextMenu', 'addWindowButtons'])
    },
    mounted() {
    }
});

</script>

<style lang="scss" scoped>

.block.project {
    padding: 156px 0 0 0;
    max-width: 512px;
    min-width: 512px;
    overflow: hidden;

    .image {
        width: 100%;
        height: 156px;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px;
        background-size: cover;
        background-position: center;
        background-image: var(--image);

        &:hover {
            * {
                opacity: 0;
            }
        }

        .date {
            padding: 4px 8px;
            position: absolute;
            right: 12px;
            bottom: 12px;
            color: var(--text-secondary);
            font-size: 12px;
            border-radius: 5px;
            backdrop-filter: blur(5px);
            transition: .2s;
        }
    }

    header {
        max-width: 100%;
        position: relative;

        .title,
        .description {
            // display: -webkit-box;
            max-width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            // line-clamp: 2;
            // -webkit-line-clamp: 2;
            // -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
        }

        .description {
            margin: 4px 0 0 0;
            color: var(--text-secondary);
            font-size: 13px;
        }
    }
}

</style>