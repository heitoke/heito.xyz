<template>
    <div class="project" ref="root">
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
            @select="isModer ? tagSettings($event) : null"
        />

        <NavBar style="padding: 12px 0;" :menu="navBarButtons" @select="block = $event.value!"/>

        <div style="margin: 0 0 12px 0; border-bottom: 1px solid var(--background-secondary-alt);"></div>

        <section v-show="block === 'links'">
            <Links :links="project?.links || []" :filters="project?.links?.length! < 1 ? [] : ['search', 'add']"
            @update="changes.links = []; changes.links = $event.list as any;"
            >
            <!-- @add="add = $event" -->
                <template v-slot:void>
                    <Alert type="mini" v-if="project?.links?.length! < 1">
                        <div>Soon everything may appear :D</div>

                        <Button style="margin: 12px 0 0 0; max-width: max-content;" v-if="isModer"
                            color="var(--green)"
                            >Create first link</Button>
                            <!-- @click="add ? add() : null" -->
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

import { PropType } from 'nuxt/dist/app/compat/capi';

import NavBar, { IButton } from '~/components/content/NavBar.vue';

import Links from '~/components/content/containers/Links.vue';

import User from '~/components/models/user/Card.vue';

import { type IProject, type IProjectMember, EProjectPermission } from '~/types/api/project';
import { EPermissions, type IUser } from '~/types/api/user';

import type { IContextMenuButton } from '~/types/stores/contextMenu';

type Block = 'links' | 'members';

const { $api } = useNuxtApp();

const root = ref<HTMLElement | null>(null);

const
    user = useUserStore(),
    contextMenu = useContextMenuStore(),
    notifications = useNotificationsStore(),
    windows = useWindowsStore();

const props = defineProps({
    windowId: { type: Number },
    data: { type: String },
    update: { type: Function }
});

const
    selfProject = ref<IProject>({} as IProject),
    changes = ref<IProject>({} as IProject),
    block = ref<Block>('links'),
    add = null as any;

const navBarButtons: Array<IButton> =  [
    { label: 'Links', icon: 'link', value: 'links' },
    { label: 'Members', icon: 'users', value: 'members' }
];


const project = computed<IProject>(() => {
    return { ...selfProject.value, ...changes.value };
});

const member = computed<IProjectMember>(() => {
    const memberIndex = project.value.members?.findIndex(member => member?.member?._id === user.getUser?._id)!;

    if (memberIndex < 0) return {} as any;

    return (project.value?.members || [])[memberIndex] || {};
});

const isModer = computed(() => {
    return Boolean(member.value?.member) && member.value?.permission !== EProjectPermission.Member;
});

const getLengthChanges = computed(() => {
    return Object.keys(changes.value).length;
});


watch(getLengthChanges, (newValue: number, oldValue: number) => {
    saveButtons(oldValue < 1 && newValue > 0, newValue < 1);
});

watch(() => selfProject.value.links?.length, () => {
    const boolean = JSON.stringify(selfProject.value.links) !== JSON.stringify(project.value.links);
    
    saveButtons(boolean, !boolean);
});


function buttonAdmin() {
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
                        text: project.value.verified ? 'Enabled' : 'Disabled',
                        click: (): void => {
                            changes.value['verified'] = !project.value.verified;
                        }
                    }
                ]
            }
        }
    ]
}

function buttonProjectSettings() {
    const buttonText = (name: 'name' | 'displayName' | 'description' = 'name', icon: string = 'text-a', label: string = 'Name') => {
        return {
            label,
            icon,
            click: () => {
                windows.create({
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
                                    text: project.value[name] || '',
                                    autofocus: true
                                },
                                events: {
                                    input: (e: InputEvent) => {
                                        changes.value[name] = (e.target as any)?.value;
                                    }
                                }
                            }
                        ],
                        buttons: [
                            {
                                label: 'Submit',
                                click: (e: MouseEvent, data: any, windowId: number) => {
                                    windows.close(windowId);
                                }
                            }
                        ]
                    }
                });
            }
        }
    };

    const changeImage = (name: 'image' | 'banner' = 'image') => {
        windows.create({
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
                            text: project.value[name] || '',
                            autofocus: true
                        },
                        events: {
                            input: (e: InputEvent) => {
                                changes.value[name] = (e.target as any)?.value;
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        label: 'Submit',
                        click: (e: MouseEvent, data: any, windowId: number) => {
                            windows.close(windowId);
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
                    click: () => changeImage(name)
                },
                {
                    label: 'Remove',
                    icon: 'close',
                    click: () => {
                        changes.value[name] = '';
                    }
                }
            ]
        } : undefined,
        click: boolean ? null : () => {
            changeImage(name);
        }
    });

    let color = '';
    const buttonColor = {
        label: 'Color',
        icon: 'colors',
        color: project.value.color,
        click: () => {
            windows.create({
                component: 'Message',
                data: {
                    title: 'Change user color',
                    icon: 'color-f',
                    components: [
                        {
                            component: 'ColorPicker',
                            name: 'color',
                            props: {
                                value: project.value?.color
                            },
                            events: {
                                color: (e: string) => {
                                    if (project.value?.color === e) return delete changes.value['color'];

                                    changes.value['color'] = color = e;
                                }
                            }
                        }
                    ],
                    buttons: [
                        {
                            label: 'Submit',
                            click: (e: MouseEvent, data: any, windowId: number) => {
                                windows.close(windowId);
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
                        windows.create({
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
                                            changes.value.tags = [...project.value.tags || [], tag];

                                            windows.close(windowId);
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
                        changes.value.tags = [];
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
                    text: project.value.private ? 'Enable' : 'Disable',
                    click: (): void => {
                        changes.value['private'] = !project.value.private;
                    }
                },
                { separator: true },
                // buttonImage(Boolean(this.project?.image)),
                buttonImage(Boolean(project.value?.banner), 'banner', 'Banner'),

                { separator: true },
                buttonText('displayName', 'heart-alt', 'Display name'),
                buttonText(),
                buttonText('description', 'text-align-left', 'Description'),

                { separator: true },
                buttonColor,
                buttonTags,
                ...(user.getUser?.permissions?.includes(EPermissions.Projects) ? buttonAdmin() : [])
            ]
        }
    } as IContextMenuButton;
}

function setButtons() {
    const contextMenuUserSettings = (e: Event) => contextMenu.create({
        name: 'window:user:settings',
        position: ['left', 'center', 'fixed'],
        event: e,
        buttons: [
            ...(isModer.value ? [buttonProjectSettings(), { separator: true } as IContextMenuButton] : []),
            {
                label: 'Copy Project ID',
                icon: 'user-circle',
                click: () => {
                    copy(project.value?._id);
                }
            }
        ]
    });

    windows.addButtons(props.windowId!, [
        {
            label: 'Settings',
            icon: 'ellipsis',
            click: (e: Event) => {
                contextMenuUserSettings(e);
            }
        }
    ]);
}

function saveButtons(isTrue: boolean, isFalse: boolean) {
    if (isTrue) {
        windows.addButtons(props.windowId!, [
            {
                label: 'Back',
                icon: 'clock-alt',
                color: 'var(--red)',
                click: () => {
                    changes.value = {} as IProject;
                }
            },
            {
                label: 'Save changes',
                icon: 'quill',
                color: 'var(--green)',
                click: async () => {
                    const [result, status] = await $api.projects.update(selfProject.value?._id, changes.value);

                    if (status !== 200) return notifications.error({
                        title: 'updated project',
                        message: result?.message,
                        status
                    });

                    notifications.push({
                        title: 'Project',
                        icon: 'image',
                        message: 'Project saved successfully',
                        color: 'var(--green)'
                    });

                    selfProject.value = project.value;
                    changes.value = {} as IProject;

                    if (props.update) props.update(project.value);
                }
            }
        ]);
    } else if (isFalse) {
        windows.removeButtons(props.windowId!, [1, 2]);
    }
}

async function loadProject(projectId: string) {
    const [result, status] = await $api.projects.get(projectId);

    if (status !== 200) {
        notifications.error({
            title: 'project',
            message: (result as any)?.message,
            status
        });

        // return this.$emit('error');
        return;
    }

    selfProject.value = { ...result, links: result?.links || [] };

    setButtons();
}

function openInvateWindow() {
    const { windowId } = windows.create({
        component: 'UserInvateUsers',
        data: {
            save: async (members: Array<{ id: string, permission: EProjectPermission }>) => {
                if (members.length < 1) return;
                
                const [result, status] = await $api.projects.invateMembers(project.value._id, members, 'invate');

                if (status !== 200) return;

                notifications.push({
                    title: 'Project invate members',
                    icon: 'image',
                    color: 'var(--green)',
                    message: `Invitations sent to ${members.length} users`
                });
                
                windows.close(windowId);
            }
        }
    });
}

function memberContextMenu(e: MouseEvent, idx: number) {
    contextMenu.create({
        name: `project:members:${idx}`,
        position: ['bottom', 'center', 'fixed'],
        event: root.value?.querySelector(`section.members .user:nth-child(${idx + 1})`)!,
        buttons: [
            {
                label: 'Kick member',
                icon: 'close',
                click: async () => {
                    const member = project.value.members![idx];

                    if (!member) return;

                    const [result, status] = await $api.projects.invateMembers(project.value._id, [{ id: member.member._id, permission: member.permission }], 'delete');

                    if (status !== 200) return;

                    selfProject.value.members = selfProject.value.members?.filter(m => m.member._id !== member.member._id);

                    if (props.update) props.update(project.value);
                }
            }
        ]
    });
}

function tagSettings(tag: IButton) {
    contextMenu.create({
        name: `project:tags:${tag.label}`,
        position: ['bottom', 'center', 'fixed'],
        buttons: [
            {
                label: 'Remove tag',
                icon: 'close',
                click: () => {
                    changes.value.tags = project.value.tags?.filter(t => t !== tag.label);
                }
            }
        ]
    });
}


onMounted(() => {
    if (props.data) loadProject(props.data);
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
                color: #fff;
                border-radius: 5px;
                border: 1px solid #fff;
                align-items: center;
                mix-blend-mode: difference;

                i {
                    margin: 0 4px 0 0;
                    color: #fff;
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

    @media (max-width: 512px) {
        min-width: 256px;

        // header {
        //     .image {
        //         ul {
        //             li {
        //                 i { margin: 0; }

        //                 span { display: none; }
        //             }
        //         }
        //     }
        // }
    }
}

</style>