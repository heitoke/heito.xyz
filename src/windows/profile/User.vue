<template>
    <div class="user">
        <header>
            <div class="banner" :style="{ height: '96px', 'background-color': user?.color }">
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
                <div class="avatar" :style="{ '--avatar': `url('${getAvatar({ nameId: user?._id })}')` }">
                    <!-- <div class="status"></div> -->
                </div>
                <Text class="username" :text="user?.nickname || user?.username || user?._id"/>
                <!-- <div class="username">{{ user?.nickname || user?.username || user?._id }}</div> -->
            </div>
        </header>

        <!-- <NavBar style="margin: 0 0 12px 0;" :menu="navMenu" @select="block = $event.value || $event.label.toLocaleLowerCase()"/> -->
        
        <!-- <Links :links="[
                {
                    label: 'WebSite',
                    text: 'Description',
                    icon: 'ticket',
                    color: '#759454',
                    url: 'https://heito.xyz'
                },
                {
                    label: 'GitHub',
                    icon: 'github',
                    color: '#000000',
                    url: 'https://github.com/heitoke'
                },
                {
                    label: 'GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub ',
                    text: 'Kkd a;skd;l askd;laskd ;laskd;as kas;dk as;kda s;kdapodqopf jw ejg 9er fgjw9e- fw0e fw',
                    icon: 'clock',
                    color: 'black',
                    url: 'https://github.com/heitoke'
                },
                {
                    label: 'GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub GitHub ',
                    text: 'Kkd a;skd;l askd;laskd ;laskd;as kas;dk as;kda s;kdapodqopf jw ejg 9er fgjw9e- fw0e fw',
                    color: 'black',
                    url: 'https://github.com/heitoke'
                }
            ]" v-show="block === 'links'"/> -->

        <!-- <Loading v-show="block === 'projects'"/> -->
    </div>
</template>

<script lang="ts" setup>

import { copy, getAvatar } from '../../libs/utils';

// import NavBar, { IButton } from '../../components/content/NavBar.vue';

// import Links from '../../components/content/lists/Links.vue';

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
        ] as any
    }),
    watch: {
        'getLengthChanges'(newValue, oldValue) {
            if (oldValue < 1 && newValue > 0) {
                this.addWindowButtons({
                    windowId: this.windowId,
                    buttons: [
                        {
                            id: 1,
                            label: 'Back',
                            icon: 'clock-alt',
                            color: 'var(--red)',
                            click: () => {
                                this.changes = {} as IUser;
                            }
                        },
                        {
                            id: 2,
                            label: 'Save changes',
                            icon: 'quill',
                            color: 'var(--green)',
                            click: async () => {
                                let [result, status] = await Users.update(this.selfUser?._id, this.changes);

                                if (status !== 200) return;

                                this.selfUser = this.user;
                                this.changes = {} as IUser;

                                if (this.selfUser?._id === this.getUser._id) this.setUser(this.selfUser);
                            }
                        }
                    ]
                });
            } else if (newValue < 1) {
                this.removeWindowButtons({
                    windowId: this.windowId,
                    buttonIds: [1, 2]
                });
            }
        }
    },
    methods: {
        ...mapActions(['createWindow', 'addWindowButtons', 'removeWindowButtons', 'setContextMenu', 'removeWindow', 'setUser']),
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
                                    this.createWindow({ component: 'Permissions', data: {
                                        list: this.user.permissions,
                                        save: (permissons: Array<EPermissions>, windowId: number) => {
                                            this.changes['permissions'] = permissons;

                                            this.removeWindow(windowId)
                                        }
                                    } });
                                }
                            },
                            { separator: true },
                            {
                                label: 'Verify',
                                icon: 'verify',
                                click: () => {
                                    this.changes['verified'] = !this.user.verified;
                                }
                            }
                        ]
                    }
                }
            ]
        },
        buttonUserSettings() {
            let buttonNickname = {
                label: 'Nickname',
                icon: 'id-card',
                click: () => {
                    this.createWindow({
                        component: 'Message',
                        data: {
                            title: 'Change nickname',
                            icon: 'id-card',
                            components: [
                                {
                                    component: 'Textbox',
                                    name: 'nickname',
                                    props: {
                                        label: 'New nickname'
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
                                        this.removeWindow(windowId);
                                    }
                                }
                            ]
                        }
                    });
                }
            };

            let buttonUsername = {
                label: 'Username',
                icon: 'username',
                click: () => {
                    this.createWindow({
                        component: 'Message',
                        data: {
                            title: 'Change username',
                            icon: 'username',
                            components: [
                                {
                                    component: 'Textbox',
                                    name: 'username',
                                    props: {
                                        label: 'New username'
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
                                        this.removeWindow(windowId);
                                    }
                                }
                            ]
                        }
                    });
                }
            };

            let color = '';
            let buttonColor = {
                label: 'Color',
                icon: 'colors',
                color: this.user.color,
                click: () => {
                    this.createWindow({
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
                                        this.removeWindow(windowId);
                                    }
                                }
                            ]
                        }
                    });
                }
            };

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
                            click: () => {
                                this.changes['private'] = !this.user.private;
                            }
                        },
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
            let contextMenuUserSettings = (e: Event) => this.setContextMenu({
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

            this.addWindowButtons({
                windowId: this.windowId,
                buttons: [
                    {
                        id: 0,
                        label: 'Settings',
                        icon: 'ellipsis',
                        click: (e: Event) => {
                            contextMenuUserSettings(e);
                        }
                    }
                ]
            });
        },
        async loadUser(userId: string) {
            let [result, status] = await Users.get(userId);

            if (status !== 200) {
                return this.$emit('error');
            }

            this.selfUser = result;

            this.setButtons();
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