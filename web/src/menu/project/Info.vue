<template>
    <div class="project-info" v-if="project"
        @contextmenu="openContextMenu([$event, `project:${project.id}`])"
    >
        <Button v-if="JSON.stringify(project) !== oldProject" text="Save сhanges" color="green" class="save" @click="save()"/>
        <div class="banner" :style="{ 'background-image': `url('${project?.image}')`, height: project?.image ? null : '0px' }"></div>
        <div class="header">
            <div class="title">{{ project?.title }}</div>
            <div class="description">{{ project?.description }}</div>
        </div>
        <ul class="tags">
            <li v-for="tag of project?.tags" :key="tag" @contextmenu="openContextMenu([$event, `project:${project.id}:tag:${tag}`])">
                <i class="uil uil-tag-alt"></i>
                <span>{{ tag }}</span>

                <!-- ContextMenu -->

                <ContextMenu :name="`project:${project.id}:tag:${tag}`" v-if="getRole">
                    <ul>
                        <li @click="project.tags = project.tags.filter(item => item !== tag)">
                            <i class="uil uil-trash" style="color: var(--C5);"></i>
                            <span>Delete tag</span>
                        </li>
                    </ul>
                </ContextMenu>
            </li>
        </ul>
        <ul class="nav-bar">
            <!-- <li :class="{ active: block === 'users' }" @click="block = 'users'">Users</li> -->
            <li :class="{ active: block === 'links' }" @click="block = 'links'"
                @contextmenu="openContextMenu([$event, `project:${project.id}:links`])"
            >Links</li>
        </ul>

        <Links class="block" :links="project?.links" :role="getRole" @onEvent="project['links'][$event.idx] = $event.link" v-if="block === 'links'"/>
    
         <!-- ContextMenu -->

        <ContextMenu :name="`project:${project.id}`" v-if="getRole">
            <ul>
                <li @click="setMenu(['SettingsEditMenu', { title: 'Image', value: project?.image, save: val => project['image'] = val }])">
                    <i :class="`uil uil-${project?.image ? 'image-edit' : 'image-plus'}`" style="color: var(--C7);"></i>
                    <span>{{ project?.image ? 'Edit' : 'Add' }} image</span>
                </li>
                <div class="line"></div>
                <li @click="project['public'] = !project?.public">
                    <i :class="`uil uil-${project?.public ? 'eye-slash' : 'eye'}`" style="color: var(--C1);"></i>
                    <span>{{ project?.public ? 'Private mode' : 'Public mode' }}</span>
                </li>
                <div class="line"></div>
                <li @click="setMenu(['SettingsEditMenu', { title: 'Title', value: project?.title, save: val => project['title'] = val }])">
                    <i class="uil uil-font" style="color: var(--C3);"></i>
                    <span>Edit title</span>
                </li>
                <li @click="setMenu(['SettingsEditMenu', { title: 'Description', value: project?.description, save: val => project['description'] = val }])">
                    <i class="uil uil-text-fields"></i>
                    <span>Edit description</span>
                </li>
                <li @click="setMenu(['SettingsEditMenu', { title: 'New Tag', save: val => project['tags'] = project['tags'] ? [ ...project['tags'], val ] : [val] }])">
                    <i class="uil uil-tag" style="color: var(--main-color);"></i>
                    <span>Add tag</span>
                </li>
                <div class="line"></div>
                <li @click="deleteProject()">
                    <i class="uil uil-trash" style="color: var(--C5);"></i>
                    <span>Delete project</span>
                </li>
            </ul>
        </ContextMenu>
        <ContextMenu :name="`project:${project.id}:links`" v-if="getRole">
            <ul>
                <li @click="setMenu(['SettingsAddLinkMenu', { title: 'Add Link', save: val => project['links'] = [ ...project['links'] || [], val ] }])">
                    <i class="uil uil-link-add" style="color: var(--C2);"></i>
                    <span>Add link</span>
                </li>
            </ul>
        </ContextMenu>
    </div>
</template>

<script>

import { defineAsyncComponent } from 'vue';

export default {
    name: 'ProjectInfoMenu',
    components: {
        Links: defineAsyncComponent(() => import('../../components/other/links.vue'))
    },
    computed: {},
    props: {
        data: { type: String }
    },
    data() {
        return {
            project: null,
            oldProject: null,
            block: 'links',
            error: false
        }
    },
    methods: {
        async load() {
            let list = await this.fetch(`/projects/${this.data}?token=${this.getLocal?.token}`);
            console.log(list);
            this.project = list;
            this.oldProject = JSON.stringify(this.project);
        },
        async save() {
            let { status } = await this.fetch(`/projects/${this.project.id}/update`, { token: this.getLocal?.token, data: { ...this.project } });
            if (status === 200) this.oldProject = JSON.stringify(this.project);
        },
        async deleteProject() {
            let { status } = await this.fetch(`/projects/${this.project.id}/remove?token=${this.getLocal?.token}`);
            if (status === 200) this.$emit('close');
        }
    },
    async mounted() {
        this.load();
    }
}
</script>

<style lang="scss" scoped>

.block.project-info {
    padding: 12px;
    max-width: 512px !important;
    min-width: 512px;
    border-radius: 5px;
    background: var(--bg);

    .save {
        cursor: pointer;
        padding: 8px 14px;
        position: absolute;
        top: -44px;
        font-size: 14px;
        transition: .2s;
        opacity: .5;

        &:hover { opacity: 1; }
    }

    .none {
        padding: 0 12px;
        width: 100%;
        color: var(--color-2);
    }

    .banner {
        width: 100%;
        height: 156px;
        position: relative;
        border-radius: 5px;
        background-size: cover;
        background-position: 50% 50%;

        .edit {
            cursor: pointer;
            padding: 4px;
            position: absolute;
            top: 12px;
            right: 12px;
            border-radius: 5px;
            transition: .2s;
            opacity: .5;

            &:hover {
                background: var(--dimming);
                opacity: 1;
            }
        }
    }

    .header {
        margin: 8px 12px 0 12px;

        .title {
            margin: 12px 0 4px 0;
            font-size: 18px;
            font-weight: 600;
            text-align: left;
            text-transform: uppercase;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .description {
            color: var(--color-2);
            font-size: 14px;
            word-break: break-all;
        }
    }

    .tags {
        margin: 8px 12px 0 12px;

        li {
            &.active {
                background: var(--dimming);
            }
        }
    }

    .nav-bar {
        margin: 0 12px 12px 12px;
    }
    
    .block {
        max-height: 276px;
        overflow-x: hidden;
    }

    .block.users {
        display: grid;
        // margin: 12px 0 0 0;
        grid-template-columns: 1fr 1fr;

        li {
            cursor: pointer;
            display: flex;
            margin: 0 8px 8px 8px;
            padding: 8px;
            border-radius: 5px;
            align-items: center;
            transition: .2s;

            &:hover {
                background: var(--dimming);

                div div:nth-child(2) { color: var(--main-color); }
            }

            img {
                margin: 0 8px 0 0;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: var(--dimming);
            }

            .username {
                font-size: 16px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            div:nth-child(2) {
                color: var(--color);
                font-size: 12px;
                transition: .2s;
            }
        }
    }

    .block.links {
        display: grid;
        grid-template-columns: 1fr 1fr;

        li {
            cursor: pointer;
            display: flex;
            margin: 0 8px 8px 8px;
            padding: 8px 14px;
            color: var(--color-2);
            align-items: center;
            border-radius: 5px;
            transition: .2s;

            &:hover {
                color: var(--color);
                background: var(--dimming);

                i { color: var(--main-color); }
            }

            i {
                margin: 0 8px 0 0;
                font-size: 20px;
                // transform: translateY(-2px);
                transition: .2s;

                // &.fab, &.fa {
                //     font-size: 14px;
                // }
            }

            img {
                margin: 0 8px 0 0;
                width: 28px;
                height: 28px;
                border-radius: 5px;
                object-fit: cover;
            }

            span {
                font-size: 14px;
            }
        }
    }
}

@media (max-width: 512px) {
    .block.project-info {
        min-width: 256px !important;

        .block.links, .block.users {
            grid-template-columns: 1fr;
        }
    }
}

</style>