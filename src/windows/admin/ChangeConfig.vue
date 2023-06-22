<template>
    <div class="change-config" v-if="config?._id">
        <div class="title">Change config {{ config.name }}</div>

        <Textbox label="Config name" :value="config.name" style="margin: 12px 0 0 0;"
            @input="config.name = ($event.target as any)?.value"
        />

        <User :user="config.user" style="margin: 12px 0;"
            text="Configuration Creator"
        />

        <NavBar :selected="true" :menu="[
            { label: 'Accounts', icon: 'user-circle', value: 'accounts' },
            { label: 'Pages', icon: 'layers', value: 'pages' },
            { label: 'Settings', icon: 'settings', value: 'settings' },
            { label: 'Theme', icon: 'brush', value: 'theme' },
        ]" @select="section = ($event?.value as string)"/>

        <section v-if="section === 'accounts'">
            <div class="filters">
                <Textbox label="Search"
                    @input="filters.text = ($event.target as any)?.value"
                />
                <Select label="Type account"
                    :menu="filters.menu"
                    @select="addAccount($event.value)"
                />
            </div>

            <ScrollBar>
                <ul v-if="config.accounts?.length > 0">
                    <li v-for="(account, idx) of config.accounts.filter(a => new RegExp(filters.text, 'g').test(a.key) || new RegExp(filters.text, 'g').test(a.type))" :key="account.key">
                        <header>
                            <Icon :name="filters.menu.find(a => a.value === account.type)?.icon"/>

                            <div>
                                <div class="name">{{ filters.menu.find(a => a.value === account.type)?.label }}</div>
                                <div class="key"
                                    @click="($event.target as HTMLElement).textContent = account.key"
                                    @contextmenu.prevent.stop="copy(account.key)"
                                    @mouseenter="setToolpic({ text: 'Right-click to copy' })"
                                >{{ '*'.repeat(account.key.length) }}</div>
                            </div>

                            <div style="margin: 0 0 0 auto;"></div>

                            <Checkbox :value="account?.enable"
                                @mouseenter="setToolpic({ text: account?.enable ? 'Enabled' : 'Disabled' })"
                                @onEvent="account.enable = !account.enable"
                            />

                            <div class="l"></div>

                            <ol class="buttons">
                                <Icon name="pencil" style="--color: var(--yellow);"
                                    @mouseenter="setToolpic({ text: 'Change' })"
                                    @click="addAccount(account.type, account)"
                                />
                                <Icon name="close" style="--color: var(--red);"
                                    @mouseenter="setToolpic({ text: 'Delete' })"
                                    @click="config.accounts = config.accounts.filter((a, i) => i !== idx)"
                                />
                            </ol>
                        </header>
                    </li>
                </ul>

                <Alert type="mini" v-else/>
            </ScrollBar>
        </section>

        <section v-if="section === 'settings'">
            <Checkbox :value="config.playingTrack" @onEvent="config.playingTrack = !config.playingTrack">
                Playing spotify music
            </Checkbox>
        </section>

        <section v-if="section === 'pages'">
            <div class="filters">
                <Textbox label="Search"
                    @input="filters.text = ($event.target as any)?.value"
                />

                <Button color="var(--green)" style="margin: 0 0 0 12px; max-width: 96px;"
                    @click="syncPages"
                >
                    <Icon name="damage-void" style="margin: 0 8px 0 0; font-size: 14px;"/>
                    <span>Sync</span>
                </Button>
            </div>

            <ScrollBar>
                <ul v-if="config.pages?.length > 0">
                    <li v-for="page of config.pages" :key="page.name">
                        <header @contextmenu="contextMenuPage(page.name)">
                            <Icon :name="pageRoute(page.name)?.meta?.icon || 'pacman'"/>
                            
                            <div>
                                <div class="name">{{ pageRoute(page.name)?.meta?.title || pageRoute(page.name)?.name }}</div>
                            </div>
    
                            <div style="margin: 0 0 0 auto;"></div>
    
                            <div class="status">{{ page.status }}</div>
    
                            <div class="l"></div>
    
                            <Checkbox :value="page?.enabled"
                                @mouseenter="setToolpic({ text: page?.enabled ? 'Enabled' : 'Disabled' })"
                                @onEvent="page.enabled = !page.enabled"
                            />
                        </header>
    
                        <div class="users" v-if="page.users?.length > 0">
                            <div v-if="page.users.filter(u => u.allowed)?.length > 0">
                                <div class="subtitle">Allow</div>
                                <ol>
                                    <div v-for="(user, idx) of page.users.filter(u => u.allowed)" :key="idx"
                                        :style="{ '--avatar': `url('${user.user?.avatar || getAvatar({ nameId: String(user.user) })}')` }"
                                        @pointerenter="setToolpic({
                                            name: `configs:pages:users:${idx}:a`,
                                            title: user?.user?.nickname || user?.user?.username || user?.user?._id || user?.user,
                                            text: 'Right-click remove user'
                                        })"
                                        @contextmenu.prevent.stop="page.users.splice(idx, 1)"
                                    ></div>
                                </ol>
                            </div>
    
                            <div v-if="page.users.filter(u => !u.allowed)?.length > 0">
                                <div class="subtitle">Deny</div>
                                <ol>
                                    <div v-for="(user, idx) of page.users.filter(u => !u.allowed)" :key="idx"
                                        :style="{ '--avatar': `url('${user.user?.avatar || getAvatar({ nameId: String(user.user) })}')` }"
                                        @pointerenter="setToolpic({
                                            name: `configs:pages:users:${idx}:d`,
                                            title: user?.user?.nickname || user?.user?.username || user?.user?._id || user?.user,
                                            text: 'Right-click remove user'
                                        })"
                                        @contextmenu.prevent.stop="page.users.splice(idx, 1)"
                                    ></div>
                                </ol>
                            </div>
                        </div>
                    </li>
                </ul>

                <Alert type="mini" v-else/>
            </ScrollBar>
        </section>

        <Alert type="mini" style="margin: 12px 0 0 0;" v-if="section === 'theme'">
            There's nothing here yet
        </Alert>

        <Button :disabled="!config.name" style="margin: 12px 0 0 0;"
            @click="data?.save ? data?.save(config, 'update', windowId as number) : null;"
        >Save сhanges</Button>
    </div>
    <Loading v-else/>
</template>

<script lang="ts" setup>

import User from '../../components/cards/User.vue';
import NavBar from '../../components/content/NavBar.vue';
import ScrollBar from '../../components/content/ScrollBar.vue';

import { copy, getAvatar } from '../../libs/utils';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { mapActions } from 'vuex';

import Configs, { IConfig, EAccountType, EPageStatus } from '../../libs/api/routes/configs';

import type { IMessage } from '../Message.vue';
import type { IAccount } from '../../libs/api/routes/configs';
import type { IContextMenu } from '../../store/modules/contextMenu';

export default defineComponent({
    name: 'WindowChangeConfigs',
    components: {},
    computed: {
        getRoutes() {
            return this.$router.options.routes;
        }
    },
    props: {
        windowId: { type: Number },
        data: {
            type: Object as PropType<{ id: string, save(newConfig: IConfig, type: 'update' | 'create', windowId: number): void }>
        }
    },
    data: () => ({
        section: 'accounts' as string,
        filters: {
            text: '',
            menu: [
                { label: 'Steam', icon: 'steam', value: EAccountType.Steam, name: 'User ID' },
                { label: 'GitHub', icon: 'github', value: EAccountType.GitHub, name: 'Username' },
                { label: 'Tetr.io', icon: 'tetris-solid', value: EAccountType.Tetr, name: 'Username' },
                { label: 'Twitch', icon: 'twitch', value: EAccountType.Twitch, name: 'Login' },
                { label: 'OSU', icon: 'pacman', value: EAccountType.OSU, name: 'Username' }
            ]
        },
        config: {} as IConfig,
        EAccountType
    }),
    watch: {},
    methods: {
        ...mapActions(['setToolpic', 'setContextMenu']),
        async loadConfig(configId: string) {
            const [result, status] = await Configs.get(configId);

            if (status !== 200) return;

            this.config = result;
        },
        addAccount(type: EAccountType, account?: IAccount) {
            const btn = this.filters.menu.find(a => a.value === type);

            if (!btn) return;

            let newAccount = <IAccount>{
                type,
                enable: true
            };

            if (account?.key) newAccount = account;

            const data: IMessage = {
                title: `${account?.key ? 'Change' : 'Create'} ${btn.label} account`,
                icon: btn.icon,
                components: [
                    {
                        component: 'Textbox',
                        name: 'key',
                        props: {
                            label: btn?.name,
                            value: newAccount?.key || ''
                        },
                        events: {
                            input: (e: InputEvent) => {
                                newAccount.key = (e.target as any)?.value;
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        label: 'Add account',
                        color: 'var(--green)',
                        click: (e: MouseEvent, data: IMessage, windowId: number) => {
                            this.config.accounts = [...this.config.accounts || [], newAccount];

                            this.$windows.close(windowId);
                        }
                    }
                ]
            };

            this.$windows.create({ component: 'Message', data });
        },
        syncPages() {
            this.config.pages = [];
            
            for (const route of this.getRoutes.filter(route => !route.meta?.notIncludeToConfig)) {
                this.config.pages = [
                    ...this.config.pages || [],
                    {
                        name: String(route?.name),
                        enabled: true,
                        status: EPageStatus.Beta,
                        users: []
                    }
                ];
            }
        },
        pageRoute(name: string) {
            return this.getRoutes!.find(r => String(r.name) === name);
        },
        contextMenuPage(name: string) {
            const page = this.config.pages.find(p => p.name === name);

            if (!page) return;

            const addUser = (allowed: boolean) => {
                const { windowId } = this.$windows.create({
                    component: 'InvateUsers',
                    data: {
                        save: (users: any) => {
                            for (let user of users) {
                                page.users.push({
                                    user: user.id,
                                    allowed
                                } as any);
                            }
                            
                            this.$windows.close(windowId);
                        }
                    }
                });
            }

            const values = Object.values(EPageStatus);

            this.setContextMenu({
                name: `config:pages:${page.name}`,
                position: ['bottom', 'center', 'fixed-target'],
                buttons: [
                    {
                        label: 'Change status',
                        children: {
                            name: `config:pages:${page.name}:status`,
                            buttons: values.map(x => ({
                                label: Object.keys(EPageStatus)[values.indexOf(x as unknown as EPageStatus)],
                                click: () => {
                                    page.status = x;
                                }
                            }))
                        }
                    },
                    { separator: true },
                    {
                        label: 'Add allow user',
                        click: () => addUser(true)
                    },
                    {
                        label: 'Add deny user',
                        click: () => addUser(false)
                    }
                ]
            } as IContextMenu);
        }
    },
    async mounted() {
        if (this.data?.id) this.loadConfig(this.data.id);
    }
});

</script>

<style lang="scss" scoped>

.block.change-config {
    max-width: 376px;

    .title {
        max-width: 100%;
        font-size: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    section {
        margin: 12px 0 0 0;
    }

    .filters {
        display: flex;
        margin: 0 0 12px 0;
        align-items: center;

        .ui-select {
            margin: 0 0 0 12px;
            max-width: 128px;
            min-width: 128px;
        }
    }

    ul {
        max-height: 256px;

        li {
            margin: 0 0 12px 0;
            padding: 8px 12px;
            max-width: 376px;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);

            &:last-child {
                margin: 0;
            }
        }

        li header {
            display: flex;
            width: 100%;
            align-items: center;
            box-sizing: border-box;
            transition: .2s;

            &.selected {
                border-color: var(--main-color) !important;
            }

            i {
                margin: 0 8px 0 0;
            }

            i + div {
                .name {
                    max-width: 196px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }

                .key {
                    cursor: pointer;
                    padding: 2px 8px;
                    color: var(--text-secondary);
                    font-size: 12px;
                    border-radius: 5px;
                    background-color: var(--background-secondary);
                    transition: .2s;
                    user-select: none;
                }
            }

            .l {
                margin: 0 8px;
                height: 16px;
                border-left: 1px solid var(--background-secondary);
            }

            .status {
                padding: 2px 6px;
                color: var(--main-color);
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                border-radius: 5px;
                background-color: var(--main-color-alt);
            }

            ol.buttons {
                i {
                    cursor: pointer;
                    color: var(--text-secondary);
                    font-size: 14px;

                    &:hover {
                        color: var(--color);
                    }

                    &:last-child {
                        margin: 0;
                    }
                }
            }
        }

        div.users {
            margin: 8px 0 0 0;
            border-top: 1px solid var(--background-secondary);

            .subtitle {
                margin: 8px 0 4px 0;
                color: var(--text-secondary);
                font-size: 10px;
                text-transform: uppercase;
            }
            
            ol {
                display: flex;
                align-items: center;

                div {
                    cursor: pointer;
                    min-width: 24px;
                    min-height: 24px;
                    border-radius: 50%;
                    background-size: cover;
                    background-position: center;
                    background-image: var(--avatar);
                    background-color: var(--background-secondary-alt);
                    transition: .2s;
                }
            }
        }
    }
}

</style>