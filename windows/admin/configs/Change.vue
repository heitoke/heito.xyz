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
                    :menu="listServicesAccounts"
                    @select="addAccount($event.value)"
                />
            </div>

            <ScrollBar>
                <ul v-if="config.accounts?.length > 0">
                    <li v-for="(account, idx) of config.accounts.filter(a => new RegExp(filters.text, 'g').test(a.key) || new RegExp(filters.text, 'g').test(a.type))" :key="account.key">
                        <header>
                            <Icon :name="listServicesAccounts.find(a => a.value === account.type)?.icon"/>

                            <div>
                                <div class="name">{{ listServicesAccounts.find(a => a.value === account.type)?.label }}</div>

                                <div class="key"
                                    @click="($event.target as HTMLElement).textContent = account.key"
                                    @contextmenu.prevent.stop="copy(account.key)"
                                    @mouseenter="toolpics.set({ text: 'Right-click to copy' })"
                                >{{ '*'.repeat(account.key.length) }}</div>
                            </div>

                            <div style="margin: 0 0 0 auto;"></div>

                            <Checkbox :value="account?.enable"
                                @mouseenter="toolpics.set({ text: account?.enable ? 'Enabled' : 'Disabled' })"
                                @onEvent="account.enable = !account.enable"
                            />

                            <div class="l"></div>

                            <ol class="buttons">
                                <Icon name="pencil" style="--color: var(--yellow);"
                                    @mouseenter="toolpics.set({ text: 'Change' })"
                                    @click="addAccount(account.type, account)"
                                />

                                <Icon name="close" style="--color: var(--red);"
                                    @mouseenter="toolpics.set({ text: 'Delete' })"
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
                            <Icon :name="(pageRoute(page.name)?.meta?.icon || 'pacman') as string"/>
                            
                            <div>
                                <div class="name">{{ pageRoute(page.name)?.meta?.title || pageRoute(page.name)?.name }}</div>
                            </div>
    
                            <div style="margin: 0 0 0 auto;"></div>
    
                            <div class="status">{{ page.status }}</div>
    
                            <div class="l"></div>
    
                            <Checkbox :value="page?.enabled"
                                @mouseenter="toolpics.set({ text: page?.enabled ? 'Enabled' : 'Disabled' })"
                                @onEvent="page.enabled = !page.enabled"
                            />
                        </header>
    
                        <div class="users" v-if="page.users?.length > 0">
                            <div v-if="page.users.filter(u => u.allowed)?.length > 0">
                                <div class="subtitle">Allow</div>
                                <ol>
                                    <div v-for="(user, idx) of page.users.filter(u => u.allowed)" :key="idx"
                                        :style="{ '--avatar': `url('${user.user?.avatar || getAvatar({ nameId: String(user.user) })}')` }"
                                        @pointerenter="userToolpic(user, `${idx}:a`)"
                                        @contextmenu.prevent.stop="page.users.splice(idx, 1)"
                                    ></div>
                                </ol>
                            </div>
    
                            <div v-if="page.users.filter(u => !u.allowed)?.length > 0">
                                <div class="subtitle">Deny</div>
                                <ol>
                                    <div v-for="(user, idx) of page.users.filter(u => !u.allowed)" :key="idx"
                                        :style="{ '--avatar': `url('${user.user?.avatar || getAvatar({ nameId: String(user.user) })}')` }"
                                        @pointerenter="userToolpic(user, `${idx}:d`)"
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

import { PropType } from 'nuxt/dist/app/compat/capi';

import User from '~/components/models/user/Card.vue';
import NavBar from '~/components/content/NavBar.vue';
import ScrollBar from '~/components/content/ScrollBar.vue';

import { type IConfig, EAccountType, EPageStatus, IAccount } from '~/types/api/config';

import type { IContextMenu } from '~/types/stores/contextMenu';

import type { IMessage } from '~/windows/Message.vue';

const { $api, $router } = useNuxtApp();

const
    windows = useWindowsStore(),
    notifications = useNotificationsStore(),
    toolpics = useToolpicsStore(),
    contextMenu = useContextMenusStore();

const props = defineProps({
    windowId: { type: Number },
    data: {
        type: Object as PropType<{
            id: string;
            save(newConfig: IConfig, type: 'update' | 'create', windowId: number): void;
        }>
    }
});

const
    section = ref<string>('accounts'),
    filters = ref({ text: '',}),
    config = ref<IConfig>({} as IConfig);

const listServicesAccounts = [
    { label: 'Steam', icon: 'steam', value: EAccountType.Steam, name: 'User ID' },
    { label: 'GitHub', icon: 'github', value: EAccountType.GitHub, name: 'Username' },
    { label: 'Tetr.io', icon: 'tetris-solid', value: EAccountType.Tetr, name: 'Username' },
    { label: 'Twitch', icon: 'twitch', value: EAccountType.Twitch, name: 'Login' },
    { label: 'OSU', icon: 'pacman', value: EAccountType.OSU, name: 'Username' }
]


const getRoutes = computed(() => {
    return $router.options.routes;
});


function userToolpic(user: any, name: string) {
    toolpics.set({
        name: `configs:pages:users:${name}`,
        title: user?.user?.nickname || user?.user?.username || user?.user?._id || user?.user,
        text: 'Right-click remove user'
    });
}

async function loadConfig(configId: string) {
    const [result, status] = await $api.configs.get(configId);

    if (status !== 200) return;

    config.value = result;
}

function addAccount(type: EAccountType, account?: IAccount) {
    const btn = listServicesAccounts.find(a => a.value === type);

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
                    config.value.accounts = [...config.value.accounts || [], newAccount];

                    windows.close(windowId);
                }
            }
        ]
    };

    windows.create({ component: 'Message', data });
}

function syncPages() {
    config.value.pages = [];
    
    for (const route of getRoutes.value.filter((route: any) => !route.meta?.notIncludeToConfig)) {
        config.value.pages = [
            ...config.value.pages || [],
            {
                name: String(route?.name),
                enabled: true,
                status: EPageStatus.Beta,
                users: []
            }
        ];
    }
}

function pageRoute(name: string) {
    return getRoutes.value!.find((route: any) => String(route.name) === name);
}

function contextMenuPage(name: string) {
    const page = config.value.pages.find(p => p.name === name);

    if (!page) return;

    const addUser = (allowed: boolean) => {
        const { windowId } = windows.create({
            component: 'InvateUsers',
            data: {
                save: (users: any) => {
                    for (let user of users) {
                        page.users.push({
                            user: user.id,
                            allowed
                        } as any);
                    }
                    
                    windows.close(windowId);
                }
            }
        });
    }

    const values = Object.values(EPageStatus);

    contextMenu.create({
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


onMounted(() => {
    if (props.data?.id) loadConfig(props.data.id);
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