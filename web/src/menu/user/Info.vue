<template>
    <div class="user-info" v-if="user">
        <main @click.right="openContextMenu([$event, `user:edit:${user.id}`])">
            <Button text="Save changes" color="green" class="save" v-if="JSON.stringify(user) !== oldUser" @click="save"/>
            <div class="banner" :style="{ 'background-image': `url('${getImage(user.banner)}')`, height: user.banner ? null : '96px !important' }">
                <!-- <div class="level"
                    @mouseenter="openContextMenu([$event, `toolpic:user:level`, 'bottom center-x fixed'])"
                >
                    <div class="bar">
                        <div class="line" :style="{ width: '32%' }"></div>
                    </div>
                    <ContextMenu :name="`toolpic:user:level`">
                        <span>1</span>
                        <span>200 / 2000</span>
                        <span>2</span>
                    </ContextMenu>
                </div> -->
                <ul class="role">
                    <UserRole v-for="role of user?.role" :key="role" :role="role"
                        @mouseenter="openContextMenu([$event, `toolpic:user:role:${role}`, 'top center-x fixed hover'])"
                    />
                    <ContextMenu v-for="role of user?.role" :key="role" :name="`toolpic:user:role:${role}`">
                        <span>{{ listRole[role] }}</span>
                    </ContextMenu>
                </ul>
            </div>
            <div class="header">
                <img :src="getImage(user.avatar)">
                <div class="username">{{ user.nickname }}</div>
            </div>
            <div v-if="user.public || getRole">
                <div class="description">{{ user.description }}</div>
                <ul class="nav-bar">
                    <li :class="{ active: block === 'links' }" @click="block = 'links'"
                        @click.right="openContextMenu([$event, `user-edit:${user.id}:links`])"
                    >Links</li>
                    <li v-if="page" :class="{ active: block === 'projects' }" @click="block = 'projects'">Projects</li>
                    <li v-if="page" :class="{ active: block === 'collections' }" @click="block = 'collections'">Сollections</li>
                    <li v-if="page" :class="{ active: block === 'groups' }" @click="block = 'groups'">Groups</li>
                    <!-- <li :class="{ active: block === 'integrations' }" @click="block = 'integrations'">Integrations</li> -->
                    <!-- <li :class="{ active: block === 'achievements' }" @click="block = 'achievements'">Achievements</li> -->
                </ul>
                <Links class="block" :links="user.links" :role="getRole" @onEvent="user.links[$event.idx] = $event.link" v-if="block === 'links'"/>
                <ul class="block projects" v-if="block === 'projects' && projects">
                    <ProjectCard v-for="project of projects" :key="project" :project="project"/>
                    <div class="none" v-if="projects.length < 1">This user is not doing anything :O</div>
                </ul>
                <div class="block collections" v-if="block === 'collections' && collections">
                    <ul>
                        <CollectionCard v-for="collection of collections" :key="collection" :card="collection" @click="router(`/collections/${collection.id}`); closeMenu(id)"/>
                        <div class="none" v-if="collections.length < 1">This user is not doing anything :O</div>
                    </ul>
                </div>
                <div class="block groups" v-if="block === 'groups' && groups">
                    <ul>
                        <GroupCard v-for="group of groups" :key="group" :group="group" @click="setMenu(['GroupInfoMenu', group?.id])" style="min-height: 196px;"/>
                        <div class="none" v-if="groups.length < 1">This user is not doing anything :O</div>
                    </ul>
                </div>
            </div>
        </main>

        <!-- ContextMenu -->

        <ContextMenu :name="`user:edit:${user.id}`">
            <ul v-if="!page && user">
                <li @click="$router.push(`/users/${user.id}`); closeMenu(id)">
                    <i class="uil uil-user-circle" style="color: var(--C2);"></i>
                    <span>Open profile</span>
                </li>
            </ul>
            <ul v-if="getRole">
                <div class="line"></div>
                <li @click="user['public'] = !user?.public">
                    <i :class="`uil uil-${user?.public ? 'eye-slash' : 'eye'}`" style="color: var(--C1);"></i>
                    <span>{{ user?.public ? 'Private' : 'Public' }} mode</span>
                </li>
                <div class="line"></div>
                <li @click="setMenu(['UploadImageMenu', { click: async (upload) => { user['banner'] = await upload(); save() } }])">
                    <i :class="`uil uil-${user?.banner ? 'image-edit' : 'image-plus'}`" style="color: var(--C7);"></i>
                    <span>{{ user?.banner ? 'Edit' : 'Add' }} banner</span>
                </li>
                <li @click="setMenu(['UploadImageMenu', { click: async (upload) => { user['avatar'] = await upload(); save() } }])">
                    <i :class="`uil uil-${user?.avatar ? 'camera' : 'camera-plus'}`" style="color: var(--C6);"></i>
                    <span>{{ user?.avatar ? 'Edit' : 'Add' }} avatar</span>
                </li>
                <!-- <li @click="setMenu(['SettingsEditMenu', { title: 'Username', value: user?.username, save: val => user['username'] = val }])">
                    <i class="uil uil-font" style="color: var(--C3);"></i>
                    <span>Edit username</span>
                </li> -->
                <div class="line"></div>
                <li @click="setMenu(['SettingsEditMenu', { title: 'Nickname', value: user?.nickname, save: val => user['nickname'] = val }])">
                    <i class="uil uil-hard-hat" style="color: var(--C4);"></i>
                    <span>Edit nickname</span>
                </li>
                <li @click="setMenu(['SettingsEditMenu', { title: 'Description', value: user?.description, save: val => user['description'] = val }])">
                    <i class="uil uil-text-fields"></i>
                    <span>Edit description</span>
                </li>
                <div class="line"></div>
                <div v-if="getUser?.role?.find(item => item === 'd' || item === 'D')">
                    <li @click="setMenu(['UserEditRoleMenu', { role: user.role, save: val => user['role'] = val }])">
                        <i class="uil uil-star"></i>
                        <span>Edit role</span>
                    </li>
                    <div class="line"></div>
                </div>
                <li @click="setMenu(['ConfirmationMenu', { title: 'Do you really want to delete the user?', yes: () => deleteUser() }])">
                    <i class="uil uil-trash" style="color: var(--C5);"></i>
                    <span>Delete user</span>
                </li>
            </ul>
        </ContextMenu>
        <ContextMenu :name="`user-edit:${user.id}:links`" v-if="getRole">
            <ul>
                <li @click="setMenu(['SettingsAddLinkMenu', { title: 'Add Link', save: val => user['links'] = [ ...user?.links, val ] }])">
                    <i class="uil uil-link-add" style="color: var(--C2);"></i>
                    <span>Add link</span>
                </li>
            </ul>
        </ContextMenu>
    </div>
</template>

<script>

import ProjectCard from '../../components/project/card.vue'
import Links from '../../components/other/links.vue'

export default {
    name: 'UserInfoMenu',
    components: { ProjectCard, Links },
    computed: {
        getRole() {
            return this.getLogin && (this.getUser?.role.includes('uw') || this.user.id === this.getUser?.id);
        }
    },
    props: {
        data: { type: String },
        id: { type: Number },
        page: { type: Boolean, default: false }
    },
    data() {
        return {
            user: null,
            oldUser: null,
            projects: null,
            collections: null,
            groups: null,
            block: 'links',
            listRole: {
                'r': 'Read',
                'w': 'Write',
                'W': 'Write+',
                'a': 'Admin',
                'A': 'Admin+',
                'd': 'Developer',
                'D': 'Developer+'
            }
        }
    },
    methods: {
        async save() {
            let { status } = await this.fetch('/users/update', { token: this.getLocal?.token, id: this.user.id, data: this.user }, 'POST');
            if (status !== 200) return;
            if (this.user.id === this.getUser?.id) this.setUser(this.user);
            this.oldUser = JSON.stringify(this.user);
        },
        async deleteUser() {
            let { status } = await this.fetch('/users/delete', { token: this.getLocal?.token, id: this.user.id }, 'POST');
            if (status !== 200) return;
            if (this.user.id === this.getUser?.id) this.setLogin(false);
            this.closeMenu(this.id);
        }
    },
    async mounted() {
        let filter = this.getLogin && this.data === this.getUser?.id ? { token: this.getLocal?.token } : { id: this.data },
            user = await this.fetch(`/users`, filter, 'POST');
        if (user.status === 404) return this.router('/');
        this.user = user;
        this.oldUser = JSON.stringify(user);
        if (this.page) {
            this.projects = await this.fetch(`/users/${this.user.id}/projects`);
            this.collections = await this.fetch(`/users/${this.user.id}/collections`);
            this.groups = await this.fetch(`/users/${this.user.id}/groups`);
        }
    }
}
</script>

<style lang="scss" scoped>

.page.user-info {
    main {
        margin: 0 auto;
        max-width: 70%;
        position: relative;
    }

    .save {
        top: 16px !important;
        left: 12px;
        opacity: 1 !important;
    }

    .banner {
        height: 215px !important;
    }

    .block {
        max-height: 100% !important;
    }

    .block.links {
        grid-template-columns: 1fr 1fr 1fr 1fr !important;
    }

    .block.projects {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .block.collections {
        max-height: 100% !important;
            
        ul {
            max-width: 512px;
            -webkit-column-count: 4;
            -webkit-column-gap:   0px;
            -moz-column-count:    4;
            -moz-column-gap:      0px;
            column-count:         4;
            column-gap:           0px;
        }
    }

    .block.groups ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 16px;
        row-gap: 16px;
    }
}
@media (max-width: 720px) {
    .page.user-info {
        min-width: 256px !important;

        main {
            max-width: 95%;
        }

        .block.links {
            grid-template-columns: 1fr !important;
        }

        .block.collections ul {
            -webkit-column-count: 1 !important;
            -webkit-column-gap:   0px !important;
            -moz-column-count:    1 !important;
            -moz-column-gap:      0px !important;
            column-count:         1 !important;
            column-gap:           0px !important;
        }

        .block.groups ul, .block.projects {
            grid-template-columns: 1fr !important;
        }
    }
}

.block.user-info {
    max-width: 512px !important;
}

.block.user-info, .page.user-info {
    min-width: 512px;
    border-radius: 5px;
    background: var(--bg);

    .save {
        position: absolute;
        top: -48px;
        opacity: .5;

        &:hover { opacity: 1; }
    }

    .banner {
        width: 100%;
        height: 156px;
        position: relative;
        border-radius: 5px;
        background-size: cover;
        background-color: var(--bg-2);
        background-position: 50% 50%;

        & * {
            transition: .2s;
        }

        // &:hover * {
        //     opacity: 0;
        // }

        .level {
            margin: 0 auto;
            padding: 16px 8px;
            max-width: 90%;

            .bar {
                width: 100%;
                height: 5px;
                position: relative;
                border-radius: 5px;
                background: var(--dimming);
                overflow: hidden;

                .line {
                    height: 8px;
                    background: var(--main-color);
                    transition: .2s;
                }
            }

            .context-menu {
                display: flex;
                padding: 4px 8px;
                font-size: 14px;
                justify-content: space-between;
            }
        }

        ul.role {
            padding: 4px;
            position: absolute;
            right: 8px;
            bottom: 8px;
            border-radius: 5px;
            background: var(--dimming);

            i {
                margin: 0 4px;
                font-size: 14px;
            }

            .context-menu {
                padding: 4px 8px;
                min-width: auto !important;
                font-size: 12px;
                font-weight: 700;
                text-align: center;
                text-transform: uppercase;
            }

        }
    }

    .none {
        padding: 0 12px;
        width: 100%;
        color: var(--color-2);
    }

    .header {
        display: flex;
        margin: 0 24px 48px 24px;
        position: relative;
        align-items: center;

        img {
            margin: 0 16px 0 0;
            width: 72px;
            height: 72px;
            position: absolute;
            top: -38px;
            border-radius: 50%;
            border: 6px solid var(--bg);
            background-color: var(--dimming);
            object-fit: cover;
        }

        .username {
            width: 80%;
            position: absolute;
            top: 8px;
            left: 96px;
            font-size: 20px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .description {
        margin: 52px 32px 12px 32px;
        color: var(--color-2);
        font-size: 14px;
        word-break: break-all;
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
        margin: 0 0 12px 0;
        padding: 0 24px;
    }

    .block {
        margin: 0 16px 12px 16px;
        max-height: 276px;
        overflow-x: hidden;
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
                //     font-size: 16px;
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

    .block.collections ul {
        max-width: 512px;
        -webkit-column-count: 2;
        -webkit-column-gap:   0px;
        -moz-column-count:    2;
        -moz-column-gap:      0px;
        column-count:         2;
        column-gap:           0px;

        li {
            margin: 0 8px 16px 8px;
        }
    }

    .block.groups ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 16px;
        row-gap: 16px;
    }

    .block.achievements ul {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;

        li {
            display: flex;
            padding: 12px;
            max-width: 100%;
            align-items: center;
            border-radius: 5px;
            background: var(--dimming);

            img {
                margin: 0 12px 0 0;
                width: 48px;
                height: 48px;
            }

            .text {
                color: var(--color-2);
                font-size: 14px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
}

@media (max-width: 512px) {
    .block.user-info {
        min-width: 256px !important;

        .block.links {
            grid-template-columns: 1fr;
        }

        .block.collections ul {
            -webkit-column-count: 1;
            -webkit-column-gap:   0px;
            -moz-column-count:    1;
            -moz-column-gap:      0px;
            column-count:         1;
            column-gap:           0px;
        }
    }
}

</style>