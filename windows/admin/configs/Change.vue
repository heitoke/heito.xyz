<template>
    <div class="change-config" v-if="config?._id">
        <div class="title">Config: {{ config.name }}</div>

        <Textbox label="Config name"
            :value="config.name"

            @update="config.name = $event"
        />

        <NavBar
            :value="section"
            :items="[
                { label: 'Accounts', icon: 'user-circle', value: 'accounts' },
                { label: 'Pages', icon: 'layers', value: 'pages' },
                { label: 'Settings', icon: 'settings', value: 'settings' },
                { label: 'Theme', icon: 'brush', value: 'theme' },
            ]"

            @select="section = $event.value"
        />

        <section class="accounts" v-if="section === 'accounts'">
            <div class="filters">
                <Textbox label="Search"/>

                <Select label="Add account"
                    :options="listAccounts"

                    @select="addAccount($event.value)"
                />
            </div>

            <ul>
                <CardAccount v-for="(account, idx) of config.accounts" :key="idx"
                    :icon="listAccounts.find(a => a.value === account.type)?.icon"
                    :label="listAccounts.find(a => a.value === account.type)?.label"
                    :account="account"

                    @enable="account.enabled = $event"
                    @contextmenu.stop.prevent="$menu.create({
                        name: `config:accounts:${idx}`,
                        items: [
                            {
                                type: 'button',
                                icon: 'pencil',
                                label: 'Change',
                                color: 'var(--yellow)',
                                click: () => {
                                    addAccount(account.type, idx);
                                }
                            },
                            { type: 'separator' },
                            {
                                type: 'button',
                                icon: 'trash',
                                label: 'Delete',
                                color: 'var(--red)',
                                click: () => {
                                    config?.accounts?.splice(idx, 1);
                                }
                            }
                        ]
                    })"
                />
            </ul>
        </section>

        <section v-else-if="section === 'pages'"></section>

        <section v-else-if="section === 'settings'">
            <Checkbox
                :value="config.playingTrack"
                :disabled="'only-click'"

                @click="config.playingTrack = !config.playingTrack"
            >
                <span style="margin-left: 12px; font-size: 14px; user-select: none;">Playing spotify music</span>
            </Checkbox>
        </section>

        <section v-else>Error</section>

        <Button label="Save"
            style="width: 100%;"
            color="var(--green)"

            @click="updateConfig"
        />
    </div>
</template>

<script lang="ts" setup>

import NavBar from '~/components/models/content/NavBar.vue';

import CardAccount from '~/components/models/windows/admin/configs/Account.vue';

import { type Config, AccountType, type Account } from '~/types/api/config';


const { $api } = useNuxtApp();


const
    $windows = useWindowsStore(),
    $menu = useContextMenuStore();


const props = defineProps<{
    windowId: string;
    data: {
        id: string;
    };
    close(): void;
}>();


const
    config = ref<Config>(),
    section = ref<string>('accounts');


const listAccounts = [
    { label: 'Steam', icon: 'steam', value: AccountType.Steam, name: 'User ID' },
    { label: 'GitHub', icon: 'github', value: AccountType.GitHub, name: 'Username' },
    { label: 'Tetr.io', icon: 'tetris-solid', value: AccountType.Tetr, name: 'Username' },
    { label: 'Twitch', icon: 'twitch', value: AccountType.Twitch, name: 'Login' },
    { label: 'OSU', icon: 'osu-alt', value: AccountType.OSU, name: 'Username' },
    { label: 'Telegram', icon: 'telegram', value: AccountType.Telegram, name: 'User ID' },
    { label: 'Discord', icon: 'discord', value: AccountType.Discord, name: 'User ID' },
    { label: 'Reddit', icon: 'reddit', value: AccountType.Reddit, name: 'Username' }
];


async function fetchConfig(configId: string) {
    const { ok, data } = await $api.configs.get(configId);

    if (!ok) return;

    config.value = data;
}

async function updateConfig() {
    if (!config.value) return;

    const { data, ok } = await $api.configs.update(config.value?._id, config.value);

    if (!ok) return;

    config.value = data;
}


function addAccount(type: AccountType, accountIndex?: number) {
    const option = listAccounts.find(a => a.value === type);

    if (!option) return;

    const key = ref<string>('');

    const account = accountIndex !== undefined ? config.value?.accounts[accountIndex] : null;

    if (account) key.value = account.key;

    const { id } = $windows.create('Message', {
        title: `${account?.key ? 'Change' : 'Create'} ${option.label} account`,
        icon: option.icon,
        components: [
            {
                name: 'key',
                component: 'Textbox',
                props: {
                    label: option.name,
                    value: key
                },
                events: {
                    update: (value: string) => {
                        key.value = value;
                    }
                },
                style: 'margin: 12px 0'
            },
            {
                name: 'btn',
                component: 'Button',
                props: {
                    label: 'Save',
                    color: 'var(--green)',
                },
                events: {
                    click: () => {
                        const newAccount: Account = {
                            type,
                            key: key.value,
                            enabled: true
                        };

                        if (account) {
                            config.value!.accounts[accountIndex!] = newAccount;
                        } else {
                            config.value!.accounts.push(newAccount);
                        }

                        $windows.close(id);
                    }
                },
                style: 'width: 100%;'
            }
        ]
    });
}


onMounted(() => {
    if (props.data?.id) {
        fetchConfig(props.data.id);
    }
});

</script>

<style lang="scss" scoped>

.block.change-config {
    max-width: 376px !important;
    width: 376px;

    .title {
        max-width: 100%;
        font-size: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .title + .ui-textbox {
        margin: 12px 0;
    }

    section {
        padding: 12px 0;
    }

    .filters {
        display: flex;
        align-self: center;

        .ui-textbox {
            margin-right: 12px;
        }
    }


    section.accounts {
        ul {
            margin-top: 12px;
            max-height: 256px;
            overflow-x: hidden;
            .account {
                &:not(:last-child) {
                    margin-bottom: 12px;
                }
            }
        }
    }
}

</style>