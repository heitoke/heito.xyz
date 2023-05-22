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
                        <Icon :name="filters.menu.find(a => a.value === account.type)?.icon"/>
                        <div class="name">{{ filters.menu.find(a => a.value === account.type)?.label }}</div>

                        <div style="margin: 0 0 0 auto;"></div>

                        <Checkbox :value="account?.enable"
                            @mouseenter="setToolpic({ text: account?.enable ? 'Enabled' : 'Disabled' })"
                            @onEvent="account.enable = !account.enable"
                        />

                        <div class="l"></div>

                        <ol>
                            <Icon name="pencil" style="--color: var(--yellow);"
                                @mouseenter="setToolpic({ text: 'Change' })"
                                @click="addAccount(account.type, account)"
                            />
                            <Icon name="close" style="--color: var(--red);"
                                @mouseenter="setToolpic({ text: 'Delete' })"
                                @click="config.accounts = config.accounts.filter((a, i) => i !== idx)"
                            />
                        </ol>
                    </li>
                </ul>
                <div class="no" v-else>So far there is nothing here</div>
            </ScrollBar>
        </section>

        <section v-if="section === 'settings'">
            <Checkbox :value="config.playingTrack" @onEvent="config.playingTrack = !config.playingTrack">
                Playing spotify music
            </Checkbox>
        </section>

        <Button :disabled="!config.name" style="margin: 12px 0 0 0;"
            @click="data?.save ? data?.save(config, 'update', windowId as number) : null;"
        >Save сhanges</Button>
    </div>
    <Loading v-else/>
</template>

<script lang="ts" setup>

import User from '../../components/cards/User.vue';
import NavBar from '../../components/content/NavBar.vue';
import ScrollBar from '../../components/ScrollBar.vue';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { mapActions } from 'vuex';

import Configs, { IConfig, EAccountType } from '../../libs/api/routes/configs';

import type { IMessage } from '../Message.vue';
import { IAccount } from '../../libs/api/routes/configs';

export default defineComponent({
    name: 'WindowChangeConfigs',
    components: {},
    computed: {},
    props: {
        windowId: { type: Number },
        data: {
            type: Object as PropType<{ id: string, save(newConfig: IConfig, type: 'update' | 'create', windowId: number): void }>
        }
    },
    data: () => ({
        section: 'accounts',
        filters: {
            text: '',
            menu: [
                { label: 'Steam', icon: 'steam', value: EAccountType.Steam, name: 'User ID' },
                { label: 'GitHub', icon: 'github', value: EAccountType.GitHub, name: 'Username' },
                { label: 'Tetr.io', icon: 'tetris-solid', value: EAccountType.Tetr, name: 'Username' }
            ]
        },
        config: {} as IConfig,
        EAccountType
    }),
    watch: {},
    methods: {
        ...mapActions(['createWindow', 'removeWindow', 'setToolpic', 'setContextMenu']),
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

                            this.removeWindow(windowId);
                        }
                    }
                ]
            };

            this.createWindow({ component: 'Message', data });
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
        overflow-x: hidden;

        li {
            display: flex;
            margin: 0 0 12px 0;
            padding: 12px;
            max-width: 376px;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            align-items: center;
            transition: .2s;

            &:last-child {
                margin: 0;
            }

            &.selected {
                border-color: var(--main-color) !important;
            }

            i {
                margin: 0 8px 0 0;
            }

            .l {
                margin: 0 8px;
                height: 16px;
                border-left: 1px solid var(--background-secondary);
            }

            .name {
                max-width: 196px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            ol {
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
    }

    .no {
        margin: 0 0 12px 0;
        padding: 12px 24px;
        color: var(--text-secondary);
        text-align: center;
        border-radius: 5px;
        border: 2px dashed var(--text-primary);
        background-color: var(--main-color-alt);
        transition: .2s;
        user-select: none;
        opacity: .5;

        &:hover {
            opacity: 1;
        }
    }
}

</style>