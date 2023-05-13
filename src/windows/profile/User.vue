<template>
    <div class="user">
        <header>
            <div class="banner" :style="{ height: '96px', 'background-color': user?.color }"></div>
            <div>
                <div class="avatar" :style="{ '--avatar': `url('${getAvatar({ nameId: user?._id })}')` }"></div>
                <div class="username">{{ user?.nickname || user?.username || user?._id }}</div>
            </div>
        </header>

        <NavBar style="margin: 0 0 12px 0;" :menu="navMenu" @select="block = $event.value || $event.label.toLocaleLowerCase()"/>
        
        <Links :links="[
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
            ]" v-show="block === 'links'"/>

        <Loading v-show="block === 'projects'"/>
    </div>
</template>

<script lang="ts" setup>

import { getAvatar } from '../../libs/functions';

import NavBar, { IButton } from '../../components/content/NavBar.vue';

import Links from '../../components/content/lists/Links.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions } from 'vuex';

import Users, { type IUser } from '../../libs/api/routes/users';

export default defineComponent({
    name: 'WindowProfileUser',
    components: {},
    computed: {},
    props: {
        windowId: { type: Number },
        data: { type: String }
    },
    data: () => ({
        user: {} as IUser,
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
    watch: {},
    methods: {
        ...mapActions(['createWindow', 'addWindowButtons', 'setContextMenu']),
        buttonUserSettings() {
            let buttonNickname = {
                label: 'Nickname',
                icon: 'id-card',
                click: () => {
                    this.createWindow({
                        component: 'Message',
                        data: {
                            title: 'Components',
                            icon: 'settings',
                            text: 'Test Text',
                            components: [
                                {
                                    component: 'Textbox',
                                    name: 'nickname',
                                    props: {
                                        label: 'New nickname'
                                    },
                                    events: {
                                        input: (e: InputEvent) => {
                                            this.user.nickname = (e.target as any)?.value;
                                        }
                                    }
                                }
                            ],
                            buttons: [
                                {
                                    label: 'Submit',
                                    click: (e: any, data: any) => {
                                        let com = data?.components?.find((c: any) => c.name === 'nickname');
                                        console.log(com);
                                    }
                                }
                            ]
                        }
                    });
                }
            };

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
                                            this.user.color = e;
                                            
                                        }
                                    }
                                }
                            ],
                            buttons: [
                                {
                                    label: 'Submit',
                                    click: (e: any, data: any) => {
                                        let com = data?.components?.find((c: any) => c.name === 'nickname');
                                        console.log(com);
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
                                this.user.private = !this.user.private;
                            }
                        },
                        { separator: true },
                        buttonNickname,
                        {
                            label: 'Username',
                            icon: 'username'
                        },
                        { separator: true },
                        buttonColor,
                        { separator: true },
                        {
                            label: 'Admin menu',
                            children: {
                                name: 'user:admin:menu',
                                title: 'Admin menu',
                                buttons: [
                                    {
                                        label: 'Verify',
                                        icon: 'verify'
                                    }
                                ]
                            }
                        }
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
                    this.buttonUserSettings(),
                    { separator: true },
                    {
                        label: 'Copy User ID',
                        icon: 'user-circle'
                    }
                ]
            });

            this.addWindowButtons({
                windowId: this.windowId,
                buttons: [
                    {
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

            this.user = result;

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
        position: relative;

        .banner {
            width: 100%;
            border-radius: 5px;
            background-color: var(--background-secondary);
        }

        .banner + div {
            display: flex;
            padding: 0 12px 0 24px;
            align-items: center;
            transform: translateY(-30%);

            .avatar {
                min-width: 64px;
                min-height: 64px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
                background-image: var(--avatar);
                background-color: var(--background-secondary-alt);
                transform: translateY(-20%);
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
}

</style>