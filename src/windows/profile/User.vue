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
                        @click="setContextMenu({
                            name: 'window:user:settings',
                            position: ['center', 'bottom', 'fixed-target'],
                            event: ($el as Element).querySelector('.permissions'),
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

        <!-- <NavBar style="margin: 0 0 12px 0;" :menu="navMenu" @select="block = $event.value || $event.label.toLocaleLowerCase()"/> -->

        <section v-show="block === 'links'">
            <Links :links="user?.links || []" :filters="user?.links?.length! < 1 ? [] : ['search', 'add']"
                @add="add = $event"
                @update="changes.links = []; changes.links = $event.list;"
            >
                <template v-slot:void>
                    <Alert type="mini" v-if="user?.links?.length! < 1">
                        <div>Soon everything may appear :D</div>
                        <Button style="margin: 12px 0 0 0; max-width: max-content;" v-if="getUser?._id === user?._id || isAdmin"
                            color="var(--green)"
                            @click="add ? add() : null"
                        >Create first link</Button>
                    </Alert>
                </template>
            </Links>
        </section>

        <!-- <Loading v-show="block === 'projects'"/> -->
    </div>
</template>

<script lang="ts" setup>

import { copy, getAvatar } from '../../libs/utils';

// import NavBar, { IButton } from '../../components/content/NavBar.vue';

import Links from '../../components/content/lists/Links.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import Users, { type IUser, EPermissions, listPermissions, type IButtonPermission } from '../../libs/api/routes/users';

export default defineComponent({
    name: 'WindowProfileUser',
    components: {},
    computed: {
        ...mapGetters(['getUser']),
        isAdmin(): boolean {
            return Boolean(this.getUser?.permissions?.includes(EPermissions.Users));
        },
        user(): IUser {
            return { ...this.selfUser, ...this.changes };
        },
        getLengthChanges(): number {
            return Object.keys(this.changes).length;
        },
        getUserPermissions(): Array<IButtonPermission> {
            let list = this.user.permissions?.filter(per => per !== EPermissions.Self) || [];
            return listPermissions.filter(p => list.includes(p.value));
        }
    },
    props: {
        windowId: { type: Number },
        data: { type: String }
    },
    data: () => ({
        selfUser: {} as IUser,
        changes: {} as IUser,
        error: false,
        block: 'links',
        navMenu: [
            {
                label: 'Links',
                icon: 'link'
            },
            {
                label: 'Projects',
                icon: 'projects'
            }
        ] as any,
        add: null as any
    }),
    watch: {
        'getLengthChanges'(newValue, oldValue) {
            this.saveButtons(oldValue < 1 && newValue > 0);
        },
        'selfUser.links.length'(newValue, oldValue) {
            this.saveButtons(JSON.stringify(this.selfUser.links) !== JSON.stringify(this.user.links));
        }
    },
    methods: {
        ...mapActions(['setContextMenu', 'setUser']),
        buttonAdmin() {
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
                                click: () => {
                                    this.$windows.create({ component: 'Permissions', data: {
                                        list: this.user.permissions,
                                        save: (permissons: Array<EPermissions>, windowId: number) => {
                                            this.changes['permissions'] = permissons;

                                            this.$windows.close(windowId)
                                        }
                                    } });
                                }
                            },
                            { separator: true },
                            {
                                label: 'Verify',
                                icon: 'verify',
                                text: this.selfUser.verified ? 'Enabled' : 'Disabled',
                                click: (): void => {
                                    this.changes['verified'] = !this.user.verified;
                                }
                            }
                        ]
                    }
                }
            ]
        },
        buttonUserSettings() {
            const buttonNickname = {
                label: 'Nickname',
                icon: 'id-card',
                click: () => {
                    this.$windows.create({
                        component: 'Message',
                        data: {
                            title: 'Change nickname',
                            icon: 'id-card',
                            components: [
                                {
                                    component: 'Textbox',
                                    name: 'nickname',
                                    props: {
                                        label: 'New nickname',
                                        text: this.user.nickname || '',
                                        autofocus: true
                                    },
                                    events: {
                                        input: (e: InputEvent) => {
                                            this.changes['nickname'] = (e.target as any)?.value;
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

            const buttonUsername = {
                label: 'Username',
                icon: 'username',
                click: () => {
                    this.$windows.create({
                        component: 'Message',
                        data: {
                            title: 'Change username',
                            icon: 'username',
                            components: [
                                {
                                    component: 'Textbox',
                                    name: 'username',
                                    props: {
                                        label: 'New username',
                                        text: this.user.nickname || '',
                                        autofocus: true
                                    },
                                    events: {
                                        input: (e: InputEvent) => {
                                            this.changes['username'] = (e.target as any)?.value;
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

            let color = '';
            const buttonColor = {
                label: 'Color',
                icon: 'colors',
                color: this.user.color,
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
                                        value: this.user?.color
                                    },
                                    events: {
                                        color: (e: string) => {
                                            if (this.user?.color === e) return delete this.changes['color'];

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

            const buttonAvatarClick = (name: 'avatar' | 'banner' = 'avatar') => {
                this.$windows.create({
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
                                    text: this.user.avatar || '',
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
                            click: () => {
                                buttonAvatarClick(name);
                            }
                        },
                        {
                            label: 'Remove',
                            icon: 'close',
                            click: () => {
                                this.changes.avatar = '';
                            }
                        }
                    ]
                } : undefined,
                click: boolean ? null : () => {
                    buttonAvatarClick(name);
                }
            })

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
                            text: this.user.private ? 'Enable' : 'Disable',
                            click: (): void => {
                                this.changes['private'] = !this.user.private;
                            }
                        },
                        { separator: true },
                        buttonAvatar(Boolean(this.user?.avatar)),
                        buttonAvatar(Boolean(this.user?.banner), 'banner', 'Banner'),
                        { separator: true },
                        buttonNickname,
                        buttonUsername,
                        { separator: true },
                        buttonColor,
                        ...(this.isAdmin ? this.buttonAdmin() : [])
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
                    ...(this.getUser?._id === this.user?._id || this.isAdmin ? [this.buttonUserSettings(), { separator: true }] : []),
                    {
                        label: 'Copy User ID',
                        icon: 'user-circle',
                        click: () => {
                            copy(this.user?._id);
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
        async loadUser(userId: string) {
            const [result, status] = await Users.get(userId);

            if (status !== 200) {
                this.$notifications.error({
                    title: 'user',
                    message: (result as any)?.message,
                    status
                });

                return this.$emit('error');
            }

            this.selfUser = { ...result, links: result?.links || [] };

            this.setButtons();
        },
        saveButtons(boolean: boolean) {
            if (boolean) {
                this.$windows.addButtons(this.windowId!, [
                    {
                        label: 'Back',
                        icon: 'clock-alt',
                        color: 'var(--red)',
                        click: () => {
                            this.changes = {} as IUser;
                        }
                    },
                    {
                        label: 'Save changes',
                        icon: 'quill',
                        color: 'var(--green)',
                        click: async () => {
                            const [result, status] = await Users.update(this.selfUser?._id, this.changes, 'links');

                            if (status !== 200) return this.$notifications.error({
                                title: 'updated user',
                                message: result?.message,
                                status
                            });

                            this.$notifications.push({
                                title: 'User',
                                icon: 'user-circle',
                                message: 'User saved successfully',
                                color: 'var(--green)'
                            });

                            this.selfUser = this.user;
                            this.changes = {} as IUser;

                            if (this.selfUser?._id === this.getUser._id) this.setUser(this.selfUser);
                        }
                    }
                ]);
            } else {
                this.$windows.removeButtons(this.windowId!, [1, 2]);
            }
        }
    },
    mounted() {
        if (!this.data) return this.$emit('error');

        this.loadUser(this.data as string);
    }
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
                    color: var(--background-secondary);
                    border-radius: 5px;
                    border: 1px solid var(--background-secondary);
                    align-items: center;

                    i {
                        margin: 0 4px 0 0;
                        color: var(--background-secondary);
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