<template>
    <li class="project" v-if="project !== undefined"
        :style="{ 'background-image': `linear-gradient(to bottom, #00000099 0%,#00000099 100%), url(${project.image})` }"
    >
        <div class="info">
            <div class="title font-5">{{ project.title || ''}}</div>
            <div class="text">{{ project.text || '' }}</div>
            <ul class="checkboxs" v-if="project.checkboxs?.length > 0">
                <li v-for="checkbox of project.checkboxs" :key="checkbox">{{ checkbox.name }}</li>
            </ul>
        </div>
        <div class="type">
            <div>{{ project.type === 'joint' ? 'Совместный' : 'Личный' }}</div>
            <ul class="users" v-if="project.type === 'joint' && project.users?.length > 0">
                <li v-for="user of project.users" :key="user"
                    :style="{ 'background-image': `url(${user.img})` }" :ui-title="user.name" uit-left
                    @click="redirect(user.url)"
                ></li>
            </ul>
        </div>
        <ul class="links" v-if="project.links?.length > 0">
            <li v-for="link of project.links" :key="link" :ui-title="link.label"
                @click="link.url ? redirect(link.url) : router(link.path)"
            >
                <i :class="link.icon"></i>
            </li>
        </ul>
    </li>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
    name: 'ProjectCard',
    props: {
        project: { type: Object }
    },
    computed: mapGetters(['']),
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}

</script>

<style lang="scss">

.projects-list {
    .project {
        margin: 0 auto 16px auto;
        // max-width: 90%;
        height: 256px;
        position: relative;
        color: #e8e8e8;
        background-size: cover;
        background-position: center;
        background-color: var(--bg-2);
        transition: .2s;

        // &:hover {
        //     box-shadow: 0 8px 12px -5px var(--dimming-4);
        //     transform:  scale(1.02);
        // }

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

</style>
