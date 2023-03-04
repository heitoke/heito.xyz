<template>
    <div class="project" :style="{ '--image': `url('${project?.image}')` }">
        <header>
            <div class="title">{{ project?.title }}</div>
            <div class="description">{{ project?.description }}</div>
        </header>

        <div>
            <ul class="members">
                <li v-for="(member, idx) of members.slice(0, 5)" :key="idx"
                    :style="{
                        '--avatar': `url('${getAvatar({ nameId: member.name })}')`
                    }"
                    @mouseenter="setToolpic({ name: `project:asd`, title: member.name })"
                ></li>
                <li v-show="members.length > 5">
                    +{{ members?.length - 5 }}
                </li>
            </ul>
            <div class="date">03.03.2023</div>
            <ul class="tags">
                <li>New</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">

import { getAvatar } from '../../libs/functions';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { mapActions } from 'vuex';

export interface IProject {
    title: string;
    description?: string;
    image?: string;
    createdAt: number;
}

export default defineComponent({
    name: 'CardProject',
    computed: {},
    props: {
        project: {
            type: Object as PropType<IProject>
        }
    },
    data: () => ({
        members: [
            {
                name: 'heito'
            },
            {
                name: 'test'
            },
            {
                name: 'bobiclaki'
            },
            {
                name: 'lyama'
            },
            {
                name: 'Ляма'
            },
            {
                name: 'gg'
            },
            {
                name: 'Саша'
            },
            {
                name: 'Никита'
            },
            {
                name: 'Олег'
            },
            {
                name: 'Влад'
            }
        ]
    }),
    methods: {
        ...mapActions(['setToolpic'])
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.project {
    cursor: pointer;
    display: flex;
    padding: 16px 24px;
    width: 100%;
    min-height: 196px;
    position: relative;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
    
    &::after {
        content: " ";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-size: cover;
        background-position: center;
        background-image: var(--image);
        transition: .2s;
        transform: scale(1.3);
        filter: blur(5px) grayscale(.5);
        z-index: -1;
    }

    &:hover {
        &::after {
            transform: scale(1.1);
            filter: blur(5px) grayscale(0);
        }
    }

    header {
        .title {
            font-size: 32px;
            font-weight: bold;
        }

        .description {
            margin: 8px 0 24px 0;
            color: var(--text-secondary);
        }
    }

    header + div {
        display: flex;
        align-items: center;

        ul.members {
            display: flex;
            margin: 0 12px 0 0;

            li {
                margin: 0 0 0 -6px;
                width: 24px;
                height: 24px;
                color: var(--text-secondary);
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                line-height: 24px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
                background-image: var(--avatar);
                background-color: var(--background-secondary);

                &:first-child {
                    margin: 0;
                }
            }
        }

        .date {
            color: var(--text-secondary);
            font-size: 12px;
        }

        ul.tags {
            display: flex;
            margin-left: auto;
            align-items: center;
        }
    }
}

</style>