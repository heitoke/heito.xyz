<template>
    <div class="user">
        <header>
            <div class="banner"
                :style="{
                    height: user?.banner ? '128px' : '96px',
                    'background-color': user?.color,
                    'background-image': `url('${user?.banner || ''}')`
                }"
            >
                <ul>
                    <li v-show="user.verified">
                        <Icon name="verify"/>
                        <span>Verify</span>
                    </li>

                    <li v-show="user.private">
                        <Icon name="eye-hide"/>
                        <span>Private</span>
                    </li>

                    <li v-show="user.isDeleted">
                        <Icon name="trash"/>
                        <span>Deleted</span>
                    </li>

                    <li class="permissions" v-show="getUserPermissions?.length > 0" style="cursor: pointer;"
                        @click="contextMenu.create({
                            name: 'window:user:settings',
                            position: ['center', 'bottom', 'fixed'],
                            event: ($el as Element).querySelector('.permissions')!,
                            buttons: getUserPermissions
                        })"    
                    >
                        <Icon name="clubs"/>
                        <span>Permissions</span>
                    </li>
                </ul>
            </div>
            
            <div>
                <div class="avatar" :style="{ '--avatar': `url('${user?.avatar || getAvatar({ nameId: user?._id })}')` }">
                    <!-- <div class="status"></div> -->
                </div>
                <Text class="username" :text="user?.nickname || user?.username || user?._id"/>
                <!-- <div class="username">{{ user?.nickname || user?.username || user?._id }}</div> -->
            </div>
        </header>

        <div class="description" v-if="user?.description">{{ user?.description }}</div>

        <NavBar style="margin: 0 0 12px 0;" :menu="navBarButtons"
            @select="block = $event.value || $event.label.toLocaleLowerCase()"
        />

        <section class="links" v-show="block === 'links'">
            <Links :links="user?.links || []" :filters="user?.links?.length! < 1 ? [] : ['search', 'add']"
                @update="changes.links = []; changes.links = $event.list;"
            >
            <!-- @add="add = $event" -->
                <template v-slot:void>
                    <Alert type="mini" v-if="user?.links?.length! < 1">
                        <div>Soon everything may appear :D</div>

                        <Button style="margin: 12px 0 0 0; max-width: max-content;" v-if="authUser.getUser?._id === user?._id || isAdmin"
                            color="var(--green)"
                        >Create first link</Button>
                    </Alert>
                        <!-- @click="add ? add() : null" -->
                </template>
            </Links>
        </section>

        <section class="projects" v-if="block === 'projects'">
            <div class="grid" v-if="!projects.loading && projects.list.length > 0">
                <Project v-for="(project, idx) of projects.list" :key="project._id"
                    :project="project"
                />
            </div>

            <Loading v-else-if="projects.loading"/>

            <Alert type="mini" v-else-if="!projects.loading"/>
        </section>
    </div>
</template>

<script lang="ts" setup>

import NavBar, { type IButton } from '~/components/content/NavBar.vue';

import Links from '~/components/content/containers/Links.vue';

import Project from '~/components/models/project/Card.vue';

import { type IUser, EPermissions, listPermissions, type IButtonPermission } from '~/types/api/user';
import type { IProject } from '~/types/api/project';
import type { IContextMenuButton } from '~/types/stores/contextMenu';

type Block = 'links' | 'projects';


const { $api } = useNuxtApp();

const
    authUser = useUserStore(),
    windows = useWindowsStore(),
    notifications = useNotificationsStore(),
    contextMenu = useContextMenuStore(),
    toolpics = useToolpicsStore();


const props = defineProps({
    windowId: { type: Number },
    data: { type: String }
});


// * Data
const
    selfUser = ref<IUser>({} as any),
    changes = ref<IUser>({} as any),
    error = ref<boolean>(false),
    block = ref<Block>('links'),
    add = ref<any>(null),
    projects = ref({
        loading: false,
        list: [] as Array<IProject>
    });

const navBarButtons: Array<IButton> = [
    {
        label: 'Links',
        icon: 'link'
    },
    {
        label: 'Projects',
        icon: 'images'
    }
];


// * Computed
const isAdmin = computed(() => {
    return authUser.getPer(EPermissions.Users);
});

const user = computed<IUser>(() => {
    return { ...selfUser.value, ...changes.value };
});

const getLengthChanges = computed(() => {
    return Object.keys(changes.value).length;
});

const getUserPermissions = computed(() => {
    const list = user.value?.permissions?.filter(per => per !== EPermissions.Self) || [];

    return listPermissions.filter(per => list.includes(per.value));
});


// * Watch
watch(block, (newValue: Block, oldValue: Block) => {
    if (newValue === oldValue) return;

    switch(newValue) {
        case 'projects':
            if (projects.value.list.length > 0) return;

            loadProjects(user.value._id);
            break;
    }
});

watch(getLengthChanges, (newValue: number, oldValue: number) => {
    saveButtons(oldValue < 1 && newValue > 0, newValue < 1);
});

watch(() => selfUser.value.links?.length, () => {
    const boolean = JSON.stringify(selfUser.value.links) !== JSON.stringify(user.value.links);
    
    saveButtons(boolean, !boolean);
});


// * Methods
function buttonAdmin() {
    const onChangePermissions = () => {
        windows.create({
            component: 'Permissions',
            data: {
                list: user.value.permissions,
                save: (permissons: Array<EPermissions>, windowId: number) => {
                    changes.value['permissions'] = permissons;

                    windows.close(windowId)
                }
            } 
        });
    }

    return [
        { separator: true },
        {
            label: 'Admin menu',
            icon: 'fire',
            children: {
                name: 'user:admin:menu',
                title: 'Admin menu',
                buttons: [
                    {
                        label: 'Permissions',
                        icon: 'clubs',
                        click: onChangePermissions
                    },
                    { separator: true },
                    {
                        label: 'Verify',
                        icon: 'verify',
                        text: user.value?.verified ? 'Enabled' : 'Disabled',
                        click: (): void => {
                            changes.value['verified'] = !user.value.verified;
                        }
                    }
                ]
            }
        }
    ];
}

function buttonUserSettings() {
    const buttonText = (name: 'nickname' | 'username' | 'description' = 'nickname', icon: string = 'id-card', label: string = 'Nickname') => {
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
                                    text: user.value[name] || '',
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

    let color = '';
    const buttonColor = {
        label: 'Color',
        icon: 'colors',
        color: user.value.color,
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
                                value: user.value?.color
                            },
                            events: {
                                color: (e: string) => {
                                    if (user.value?.color === e) return delete changes.value['color'];

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

    const onChangeAvatarOrBanner = (name: 'avatar' | 'banner' = 'avatar') => {
        windows.create({
            component: 'Message',
            data: {
                title: `Change user ${name}`,
                icon: 'image',
                components: [
                    {
                        component: 'Textbox',
                        name: name,
                        props: {
                            label: `New ${name} (URL)`,
                            text: user.value[name] || '',
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
    const buttonAvatar = (boolean: boolean, name: 'avatar' | 'banner' = 'avatar', label: string = 'Avatar') => ({
        label,
        icon: 'image',
        children: boolean ? {
            name: `user:settings:${name}`,
            title: `User ${name}`,
            buttons: [
                {
                    label: 'Change',
                    icon: 'pencil',
                    click: () => onChangeAvatarOrBanner(name)
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
            onChangeAvatarOrBanner(name);
        }
    });

    return {
        label: 'User settings',
        icon: 'settings',
        children: {
            name: 'user:settings',
            title: 'User settings',
            buttons: [
                {
                    label: 'Private mode',
                    icon: 'eye',
                    text: user.value.private ? 'Enable' : 'Disable',
                    click: (): void => {
                        changes.value['private'] = !user.value.private;
                    }
                },

                { separator: true },
                buttonAvatar(Boolean(user.value?.avatar)),
                buttonAvatar(Boolean(user.value?.banner), 'banner', 'Banner'),

                { separator: true },
                buttonText(),
                buttonText('username', 'username', 'Username'),
                buttonText('description', 'text-align-left', 'Description'),

                { separator: true },
                buttonColor,
                ...(isAdmin.value ? buttonAdmin() : [])
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
            ...(authUser.getUser?._id === user.value?._id || isAdmin.value ? [buttonUserSettings(), { separator: true } as IContextMenuButton] : []),
            {
                label: 'Copy User ID',
                icon: 'user-circle',
                click: () => {
                    copy(user.value?._id);
                }
            }
        ]
    });

    windows.addButtons(props.windowId!, [
        {
            label: 'Settings',
            icon: 'ellipsis',
            click: contextMenuUserSettings
        }
    ]);
}

async function loadProjects(userId: string) {
    projects.value.loading = true;

    const [result, status] = await $api.users.projects(userId);

    if (status !== 200) {
        notifications.error({
            title: 'user',
            message: (result as any)?.message,
            status
        });

        return;
    }

    projects.value = {
        loading: false,
        list: result.results
    }
}

async function loadUser(userId: string) {
    const [result, status] = await $api.users.get(userId);

    if (status !== 200) {
        notifications.error({
            title: 'user',
            message: (result as any)?.message,
            status
        });

        return;
    }

    selfUser.value = { ...result, links: result?.links || [] };

    setButtons();
}

function saveButtons(isTrue: boolean, isFalse: boolean) {
    if (isTrue) {
        windows.addButtons(props.windowId!, [
            {
                label: 'Back',
                icon: 'clock-alt',
                color: 'var(--red)',
                click: () => {
                    changes.value = {} as IUser;
                }
            },
            {
                label: 'Save changes',
                icon: 'quill',
                color: 'var(--green)',
                click: async () => {
                    const [result, status] = await $api.users.update(selfUser.value?._id, changes.value, 'links');

                    if (status !== 200) return notifications.error({
                        title: 'updated user',
                        message: result?.message,
                        status
                    });

                    notifications.push({
                        title: 'User',
                        icon: 'user-circle',
                        message: 'User saved successfully',
                        color: 'var(--green)'
                    });

                    selfUser.value = user.value;
                    changes.value = {} as IUser;

                    if (selfUser.value?._id === authUser.getUser._id) authUser.set(selfUser.value);
                }
            }
        ]);
    } else if (isFalse) {
        windows.removeButtons(props.windowId!, [1, 2]);
    }
}

onMounted(() => {
    if (!props.data) return;

    loadUser(props.data);
});

</script>

<style lang="scss" scoped>

.block.user {
    max-width: 512px;
    min-width: 512px;

    header {
        max-width: 100%;
        position: relative;

        .banner {
            width: 100%;
            position: relative;
            border-radius: 5px;
            background-size: cover;
            background-position: 50% 50%;
            background-color: var(--background-secondary);
            transition: .2s;

            ul {
                display: flex;
                position: absolute;
                top: 8px;
                right: 0;
                align-items: center;
                transition: .2s;
                user-select: none;

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
        }

        .banner + div {
            display: flex;
            padding: 0 12px 0 24px;
            align-items: center;
            transform: translateY(-30%);

            .avatar {
                min-width: 64px;
                min-height: 64px;
                position: relative;
                border-radius: 50%;
                // box-shadow: 0 0 10px 5px var(--green);
                background-size: cover;
                background-position: center;
                background-image: var(--avatar);
                background-color: var(--background-secondary-alt);
                transform: translateY(-20%);

                .status {
                    width: 12px;
                    height: 12px;
                    position: absolute;
                    right: 2px;
                    bottom: 2px;
                    border-radius: 50%;
                    background-color: var(--green);
                }
            }
            
            .username {
                margin: 0 0 0 12px;
                max-width: 100%;
                font-size: 16px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            } 
        }
    }

    .description {
        margin: 0 0 12px 0;
        padding: 0 4px;
    }

    section.projects {
        .grid {
            .project {
                margin: 0 0 12px 0;

                &:last-child {
                    margin: 0;
                }
            }
        }
    }

    @media (max-width: 512px) {
        min-width: 256px;

        header {
            .banner {
                ul {
                    li {
                        i { margin: 0; }

                        span { display: none; }
                    }
                }
            }
        }
    }
}

</style>