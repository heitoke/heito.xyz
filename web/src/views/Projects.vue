<template>
    <div class="projects">
        <div class="stats">
            <div class="count"><span>всего</span> {{ list.filter(f => f.on).length }} <span>{{ otf(list.length, 'проект', 'проекта', 'проектов') }}</span></div>
            <ul class="filters">
                <li v-for="button of filters.buttons" :key="button"
                    :class="{ 'active': filters.type === button.type }"
                    @click="filters.type = button.type"
                >
                    {{ button.title }}
                </li>
            </ul>
        </div>
        <ul class="list">
            <ProjectCard v-for="project of list.filter(f => (filters.type === 'all' ? true : f.type === filters.type) && f.on)" :key="project"
                :project="project"
            />
        </ul>
    </div>
</template>

<script>

import ProjectCard from '../components/project-card.vue'

export default {
    name: 'ProjectsPage',
    components: { ProjectCard },
    computed: {},
    data() {
        return {
            img: 'https://github.com/webgtx/wxplorer/raw/main/.media/preview.gif',
            img2: 'https://i.kym-cdn.com/photos/images/facebook/000/073/884/aang_handsome.jpg',
            filters: {
                type: 'all',
                buttons: [
                    { title: 'Все', type: 'all' },
                    { title: 'Личные', type: 'personal' },
                    { title: 'Совместные', type: 'joint' }
                ]
            },
            list: [
                {
                    type: 'joint',
                    title: 'Mirai',
                    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, mollitia.',
                    image: 'https://github.com/webgtx/wxplorer/raw/main/.media/preview.gif',
                    checkboxs: [
                        { name: 'Chat' },
                        { name: 'Open-Source' }
                    ],
                    links: [
                        { label: 'Перейти', url: 'https://chat.akiracommunity.ru', icon: 'uil uil-link' },
                        { label: 'Открыть', url: '/chat', icon: 'uil uil-bookmark' }
                    ],
                    users: [
                        { name: 'dxv1d', img: 'https://avatars.githubusercontent.com/u/62614322?v=4', url: 'https://github.com/webgtx' }
                    ]
                },
                { type: 'personal' },
                { type: 'joint' },
                { type: 'joint' },
                { type: 'joint' }
            ]
        }
    },
    methods: {},
    async mounted() {
        this.list = await this.postFetch('/projects');
    }
}
</script>

<style lang="scss">

.page.projects {
    margin: 48px auto 0 auto;
    max-width: 50%;

    .stats {
        display: flex;
        margin: 0 0 16px 0;
        padding: 24px 0;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--color-2);

        .count {
            font-size: 32px;

            span {
                color: var(--color-2);
                font-size: 12px;
                text-transform: uppercase;
                user-select: none;
            }
        }

        .filters {
            display: flex;
            align-items: center;
            user-select: none;

            li {
                cursor: pointer;
                margin: 0 0 0 8px;
                padding: 8px 24px;
                font-size: 12px;
                text-transform: uppercase;
                border: 1px solid var(--T);
                transition: .2s;

                &.active {
                    text-decoration: underline;
                    border: 1px solid var(--color);
                    background: var(--dimming);
                }
            }
        }
    }

    .list {
        .project {
            margin: 0 auto 16px auto;
            max-width: 90%;
            height: 256px;
            position: relative;
            color: #e8e8e8;
            background-size: cover;
            background-position: center;
            background-color: var(--bg-2);
            transition: .2s;

            &:hover {
                box-shadow: 0 8px 12px -5px var(--dimming-4);
                transform:  scale(1.02);
            }

            .info {
                padding: 16px 0 0 16px;

                .title {
                    font-size: 32px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .text {
                    max-width: 40%;
                    opacity: .7;
                }

                .checkboxs {
                    margin: 16px 0 0 0;
                    
                    li {
                        display: flex;
                        margin: 4px 0 0 0;
                        font-size: 13px;
                        align-items: center;

                        &::before {
                            content: " ";
                            margin: 0 6px 0 0;
                            width: 7px;
                            height: 7px;
                            border: 1px solid #e8e8e8;
                            transform: rotate(45deg);
                        }
                    }
                }
            }

            .type {
                display: flex;
                position: absolute;
                top: 16px;
                right: 16px;
                align-items: flex-end;
                flex-direction: column;
                
                div {
                    color: var(--color-3);
                    font-size: 10px;
                    text-transform: uppercase;
                }

                .users {
                    li {
                        cursor: pointer;
                        margin: 8px 0 0 0;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background-size: cover;
                    }
                }
            }

            .links {
                display: flex;
                position: absolute;
                left: 16px;
                bottom: 16px;
                align-items: center;

                li {
                    cursor: pointer;
                    margin: 0 8px 0 0;
                    opacity: .8;
                    
                    &:hover {
                        opacity: 1;
                    }
                }
            }
        }
    }

    @media (max-width: 1200px) {
        & {
            max-width: 75%;
        }
    }

    @media (max-width: 600px) {
        & {

            .stats {
                display: block;

                .count {
                    text-align: center;
                }

                .filters {
                    margin: 8px 0 0 0;
                    justify-content: center;
                }
            }
        }
    }

    @media (max-width: 540px) {
        & {
            max-width: 95%;

            .stats {
                display: block;

                .count {
                    text-align: center;
                }

                .filters {
                    display: block;
                    
                    li {
                        margin: 8px 0 0 0;
                        text-align: center;
                    }
                }
            }

            .list .project {
                .info {
                    .text {
                        max-width: 80%;
                    }
                }
            }
        }
    }

}

</style>