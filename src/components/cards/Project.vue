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
                        '--avatar': `url('${getAvatar({ nameId: member.name })}')`,
                        opacity: hoverMember > -1 ? (hoverMember === idx ? 1 : 0) : 1
                    }"
                    @mouseenter="setToolpic({ name: `project:asd`, title: member.name }); hoverMember = idx"
                    @mouseleave="hoverMember = -1"
                ></li>
                <li v-show="members.length > 5" :style="{ opacity: hoverMember > -1 ? 0 : 1 }">
                    +{{ members?.length - 5 }}
                </li>
            </ul>
            <div class="date">{{ time.format(Date.now(), 'dd MMM YYYY') }}</div>
            <ul class="tags">
                <li>New 1</li>
                <li>New 2</li>
                <li>New 3</li>
                <li>New 4</li>
                <li>New 5</li>
                <li>New 6</li>
                <li>New 7</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">

import { getAvatar, time } from '../../libs/utils';

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
        hoverMember: -1,
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
        ...mapActions(['setToolpic', 'setContextMenu'])
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
    transition: .2s;
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
        .title, .description {
            display: -webkit-box;
            text-overflow: ellipsis;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

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
                transition: .2s;

                &:first-child {
                    margin: 0;
                }
            }
        }

        .date {
            color: var(--text-secondary);
            font-size: 12px;
            white-space: nowrap;
            mix-blend-mode: difference;
        }

        ul.tags {
            display: flex;
            margin: 0 0 0 12px !important;
            margin-left: auto;
            align-items: center;
            justify-content: flex-end;
            overflow: hidden;

            li {
                margin: 0 8px 0 0;
                padding: 4px 8px;
                font-size: 12px;
                white-space: nowrap;
                border-radius: 5px;
                background-color: #00000055;
                backdrop-filter: blur(5px);
                transition: .2s;

                &:last-child {
                    margin: 0;
                }
            }
        }
    }
}

</style>