<template>
    <div class="project">
        <div class="image"
            :style="{
                height: `${project?.banner ? 156 : 128}px`,
                '--image': `url('${project?.banner}')`,
                'background-color': project?.color
            }"
        >
            <ul>
                <li v-show="project.verified">
                    <Icon name="verify"/>
                    <span>Verify</span>
                </li>
                <li v-show="project.private">
                    <Icon name="eye-hide"/>
                    <span>Private</span>
                </li>
                <li v-show="project.isDeleted">
                    <Icon name="trash"/>
                    <span>Deleted</span>
                </li>
            </ul>

            <div class="date" v-if="project?.createdAt">{{ time.format(`${project?.createdAt}`, 'dd MMM YYYY') }}</div>
        </div>

        <header>
            <div class="title">{{ project?.displayName || project?.name || project?._id }}</div>
            <div class="description">{{ project.description }}</div>
        </header>
        
        <NavBar style="margin: 12px 0 0 0;" v-if="project?.tags?.length! > 0"
            :menu="project.tags?.map(tag => ({ label: tag, icon: 'tag' } as any))"
            :selected="false"
        />

        <NavBar style="padding: 12px 0;" :menu="navBar" @select="block = $event.value!"/>

        <div style="margin: 0 0 12px 0; border-bottom: 1px solid var(--background-secondary-alt);"></div>

        <section v-show="block === 'links'">
            <Links :links="project?.links || []" :filters="project?.links?.length! < 1 ? [] : ['search', 'add']"
                @add="add = $event"
                @update="changes.links = []; changes.links = $event.list as any;"
            >
                <template v-slot:void>
                    <Alert type="mini" v-if="project?.links?.length! < 1">
                        <div>Soon everything may appear :D</div>

                        <Button style="margin: 12px 0 0 0; max-width: max-content;" v-if="isModer"
                            color="var(--green)"
                            @click="add ? add() : null"
                        >Create first link</Button>
                    </Alert>
                </template>
            </Links>
        </section>

        <section class="members" v-show="block === 'members'">
            <div style="display: flex; margin: 0 0 12px 0;" v-if="project?.members?.length! > 0">
                <Textbox label="Search"/>

                <Button style="width: 96px; margin: 0 0 0 12px;" v-if="isModer" 
                    @click="openInvateWindow"
                >Invate</Button>
            </div>

            <Alert type="mini" v-else/>

            <div class="grid" v-if="project?.members?.length! > 0">
                <User v-for="(member, idx) of project?.members" :key="idx" :id="member.member._id"
                    :user="member.member" :text="member.permission"
                    @contextmenu="memberContextMenu($event, idx)"
                />
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>

import { getAvatar, time } from '../../libs/utils';

import NavBar from '../../components/content/NavBar.vue';

import Links from '../../components/content/lists/Links.vue';

import User from '../../components/cards/User.vue';

</script>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import Projects, { type IProject, type IProjectMember, EProjectPermission } from '../../libs/api/routes/projects';
import Users, { EPermissions, IUser } from '../../libs/api/routes/users';

import { copy } from '../../libs/utils';
import { IContextMenu } from '../../store/modules/contextMenu';

export default defineComponent({
    name: 'WindowProfileProject',
    components: {},
    computed: {
        ...mapGetters(['getUser']),
        project(): IProject {
            return { ...this.selfProject, ...this.changes };
        },
        member(): IProjectMember {
            const memberIndex = this.project.members?.findIndex(member => member?.member?._id === this.getUser?._id)!;

            if (memberIndex < 0) return {} as any;

            return (this.project?.members || [])[memberIndex] || {};
        },
        isModer() {
            return Boolean(this.member?.member) && this.member?.permission !== EProjectPermission.Member;
        },
        getLengthChanges(): number {
            return Object.keys(this.changes).length;
        }
    },
    props: {
        windowId: { type: Number },
        data: { type: String },
        update: { type: Function }
    },
    data: () => ({
        EProjectPermission,
        selfProject: {} as IProject,
        changes: {} as IProject,
        block: 'links',
        navBar: [
            { label: 'Links', icon: 'link', value: 'links' },
            { label: 'Members', icon: 'users', value: 'members' }
        ],
        add: null as any
    }),
    watch: {
        'getLengthChanges'(newValue, oldValue) {
            this.saveButtons(oldValue < 1 && newValue > 0, newValue < 1);
        },
        'selfProject.links.length'(newValue, oldValue) {
            const boolean = JSON.stringify(this.selfProject.links) !== JSON.stringify(this.project.links);
            this.saveButtons(boolean, !boolean);
        }
    },
    methods: {
        ...mapActions(['setContextMenu']),
        buttonAdmin() {
            return [
                { separator: true },
                {
                    label: 'Admin menu',
                    icon: 'fire',
                    children: {
                        name: 'project:admin:menu',
                        title: 'Admin menu',
                        buttons: [
                            {
                                label: 'Verify',
                                icon: 'verify',
                                text: this.project.verified ? 'Enabled' : 'Disabled',
                                click: (): void => {
                                    this.changes['verified'] = !this.project.verified;
                                }
                            }
                        ]
                    }
                }
            ]
        },
        buttonProjectSettings() {
            const buttonText = (name: 'name' | 'displayName' | 'description' = 'name', icon: string = 'text-a', label: string = 'Name') => {
                return {
                    label,
                    icon,
                    click: () => {
                        this.$windows.create({
                            component: 'Message',
                            data: {
                                title: `Change ${name}`,
                                icon,
                                components: [
                                    {
                                        component: 'Textbox',
                                        name,
                                        props: {
                                            label: `New ${name}`,
                                            text: this.project[name] || '',
                                            autofocus: true
                                        },
                                        events: {
                                            input: (e: InputEvent) => {
                                                this.changes[name] = (e.target as any)?.value;
                                            }
                                        }
                                    }
                                ],
                                buttons: [
                                    {
                                        label: 'Submit',
                                        click: (e: MouseEvent, data: any, windowId: number) => {
                                            this.$windows.close(windowId);
                                        }
                                    }
                                ]
                            }
                        });
                    }
                }
            };

            const buttonImageClick = (name: 'image' | 'banner' = 'image') => {
                this.$windows.create({
                    component: 'Message',
                    data: {
                        title: `Change project ${name}`,
                        icon: 'image',
                        components: [
                            {
                                component: 'Textbox',
                                name: name,
                                props: {
                                    label: `New ${name} (URL)`,
                                    text: this.project[name] || '',
                                    autofocus: true
                                },
                                events: {
                                    input: (e: InputEvent) => {
                                        this.changes[name] = (e.target as any)?.value;
                                    }
                                }
                            }
                        ],
                        buttons: [
                            {
                                label: 'Submit',
                                click: (e: MouseEvent, data: any, windowId: number) => {
                                    this.$windows.close(windowId);
                                }
                            }
                        ]
                    }
                });
            };
            const buttonImage = (boolean: boolean, name: 'image' | 'banner' = 'image', label: string = 'Image') => ({
                label,
                icon: 'image',
                children: boolean ? {
                    name: `project:settings:${name}`,
                    title: `Project ${name}`,
                    buttons: [
                        {
                            label: 'Change',
                            icon: 'pencil',
                            click: () => {
                                buttonImageClick(name);
                            }
                        },
                        {
                            label: 'Remove',
                            icon: 'close',
                            click: () => {
                                this.changes[name] = '';
                            }
                        }
                    ]
                } : undefined,
                click: boolean ? null : () => {
                    buttonImageClick(name);
                }
            });

            let color = '';
            const buttonColor = {
                label: 'Color',
                icon: 'colors',
                color: this.project.color,
                click: () => {
                    this.$windows.create({
                        component: 'Message',
                        data: {
                            title: 'Change user color',
                            icon: 'color-f',
                            components: [
                                {
                                    component: 'ColorPicker',
                                    name: 'color',
                                    props: {
                                        value: this.project?.color
                                    },
                                    events: {
                                        color: (e: string) => {
                                            if (this.project?.color === e) return delete this.changes['color'];

                                            this.changes['color'] = color = e;
                                        }
                                    }
                                }
                            ],
                            buttons: [
                                {
                                    label: 'Submit',
                                    click: (e: MouseEvent, data: any, windowId: number) => {
                                        this.$windows.close(windowId);
                                    }
                                }
                            ]
                        }
                    });
                }
            };

            let tag = '';
            const buttonTags = {
                label: 'Tags',
                icon: 'tag',
                children: {
                    name: `project:settings:tags`,
                    title: `Tags`,
                    buttons: [
                        {
                            label: 'Add new tag',
                            icon: 'tag',
                            click: () => {
                                this.$windows.create({
                                    component: 'Message',
                                    data: {
                                        title: 'New tag',
                                        components: [
                                            {
                                                name: 'name',
                                                component: 'Textbox',
                                                props: { label: 'Name tag' },
                                                events: {
                                                    input(e: InputEvent) {
                                                        tag = (e.target as any)?.value;
                                                    }
                                                }
                                            }
                                        ],
                                        buttons: [
                                            {
                                                label: 'Add tag',
                                                click: (e: MouseEvent, data: any, windowId: number) => {
                                                    this.changes.tags = [...this.project.tags || [], tag];

                                                    this.$windows.close(windowId);
                                                }
                                            }
                                        ]
                                    }
                                });
                            }
                        },
                        {
                            label: 'Remove all',
                            icon: 'close',
                            click: () => {
                                this.changes.tags = [];
                            }
                        }
                    ]
                }
            }

            return {
                label: 'Project settings',
                icon: 'settings',
                children: {
                    name: 'project:settings',
                    title: 'Project settings',
                    buttons: [
                        {
                            label: 'Private mode',
                            icon: 'eye',
                            text: this.project.private ? 'Enable' : 'Disable',
                            click: (): void => {
                                this.changes['private'] = !this.project.private;
                            }
                        },
                        { separator: true },
                        // buttonImage(Boolean(this.project?.image)),
                        buttonImage(Boolean(this.project?.banner), 'banner', 'Banner'),
                        { separator: true },
                        buttonText('displayName', 'heart-alt', 'Display name'),
                        buttonText(),
                        buttonText('description', 'text-align-left', 'Description'),
                        { separator: true },
                        buttonColor,
                        buttonTags,
                        ...(this.getUser?.permissions?.includes(EPermissions.Projects) ? this.buttonAdmin() : [])
                    ]
                }
            };
        },
        setButtons() {
            const contextMenuUserSettings = (e: Event) => this.setContextMenu({
                name: 'window:user:settings',
                position: ['left', 'fixed-target'],
                event: e,
                buttons: [
                    ...(this.isModer ? [this.buttonProjectSettings(), { separator: true }] : []),
                    {
                        label: 'Copy Project ID',
                        icon: 'user-circle',
                        click: () => {
                            copy(this.project?._id);
                        }
                    }
                ]
            });

            this.$windows.addButtons(this.windowId!, [
                {
                    label: 'Settings',
                    icon: 'ellipsis',
                    click: (e: Event) => {
                        contextMenuUserSettings(e);
                    }
                }
            ]);
        },
        saveButtons(isTrue: boolean, isFalse: boolean) {
            if (isTrue) {
                this.$windows.addButtons(this.windowId!, [
                    {
                        label: 'Back',
                        icon: 'clock-alt',
                        color: 'var(--red)',
                        click: () => {
                            this.changes = {} as IProject;
                        }
                    },
                    {
                        label: 'Save changes',
                        icon: 'quill',
                        color: 'var(--green)',
                        click: async () => {
                            const [result, status] = await Projects.update(this.selfProject?._id, this.changes);

                            if (status !== 200) return this.$notifications.error({
                                title: 'updated project',
                                message: result?.message,
                                status
                            });

                            this.$notifications.push({
                                title: 'Project',
                                icon: 'image',
                                message: 'Project saved successfully',
                                color: 'var(--green)'
                            });

                            this.selfProject = this.project;
                            this.changes = {} as IProject;

                            if (this.update) this.update(this.project);
                        }
                    }
                ]);
            } else if (isFalse) {
                this.$windows.removeButtons(this.windowId!, [1, 2]);
            }
        },
        async loadProject(projectId: string) {
            const [result, status] = await Projects.get(projectId);

            if (status !== 200) {
                this.$notifications.error({
                    title: 'project',
                    message: (result as any)?.message,
                    status
                });

                return this.$emit('error');
            }

            this.selfProject = { ...result, links: result?.links || [] };

            this.setButtons();
        },
        openInvateWindow() {
            const { windowId } = this.$windows.create({
                component: 'InvateUsers',
                data: {
                    save: async (members: Array<{ id: string, permission: EProjectPermission }>) => {
                        if (members.length < 1) return;
                        
                        const [result, status] = await Projects.invateMembers(this.project._id, members, 'invate');

                        if (status !== 200) return;

                        this.$notifications.push({
                            title: 'Project invate members',
                            icon: 'image',
                            color: 'var(--green)',
                            message: `Invitations sent to ${members.length} users`
                        });
                        
                        this.$windows.close(windowId);
                    }
                }
            });
        },
        memberContextMenu(e: MouseEvent, idx: number) {
            this.setContextMenu({
                name: `project:members:${idx}`,
                position: ['bottom', 'center', 'fixed-target'],
                event: (this.$el as Element).querySelector(`section.members .user:nth-child(${idx + 1})`),
                buttons: [
                    {
                        label: 'Kick member',
                        icon: 'close',
                        click: async () => {
                            const member = this.project.members![idx];

                            if (!member) return;

                            const [result, status] = await Projects.invateMembers(this.project._id, [{ id: member.member._id, permission: member.permission }], 'delete');

                            if (status !== 200) return;

                            this.selfProject.members = this.selfProject.members?.filter(m => m.member._id !== member.member._id);

                            if (this.update) this.update(this.project);
                        }
                    }
                ]
            } as IContextMenu)
        }
    },
    mounted() {
        if (this.data) this.loadProject(this.data);
    }
});

</script>

<style lang="scss" scoped>

.block.project {
    max-width: 512px;
    min-width: 512px;
    // overflow: hidden;

    .image {
        width: calc(100% + 24px);
        position: relative;
        top: -12px;
        left: -12px;
        border-radius: 5px;
        background-size: cover;
        background-position: center;
        background-image: var(--image);
        background-color: var(--background-secondary-alt);

        &:hover {
            * {
                opacity: 0;
            }
        }

        ul {
            display: flex;
            position: absolute;
            top: 8px;
            right: 0;
            align-items: center;
            transition: .2s;
            user-select: none;
            z-index: 1;

            li {
                display: flex;
                margin: 0 8px 0 0;
                padding: 2px 4px;
                position: relative;
                color: var(--text-secondary);
                border-radius: 5px;
                border: 1px solid var(--text-secondary);
                align-items: center;

                i {
                    margin: 0 4px 0 0;
                    color: var(--text-secondary);
                    font-size: 14px;
                }

                span {
                    font-size: 12px;
                }

                ol {
                    width: calc(100% - 8px);
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0px;

                    li {
                        margin: 0 0 4px 0;
                        width: 100%;
                    }
                }
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

    .members {
        .grid {
            display: grid;
            max-width: 100%;
            position: relative;
            grid-template-columns: repeat(2, 50%);

            .user {
                width: auto;

                &:nth-child(1n) {
                    margin: 12px 6px 0 0;
                }
                &:nth-child(2n) {
                    margin: 12px 0 0 6px;
                }

                &:nth-child(1) {
                    margin: 0 6px 0 0 !important;   
                }

                &:nth-child(2) {
                    margin: 0 0 0 6px !important;   
                }
            }
        }
    }
}

</style>