<template>
    <div class="configs">
        <div class="title">Configs</div>

        <div class="filters">
            <Textbox label="Search" @input="filters.text = ($event.target as any)?.value"/>
            <Button color="var(--green)" @click="create" v-if="selected?.length < 1">Create</Button>
            <Select label="Action" v-else
                :menu="[
                    { label: 'Delete', icon: 'trash', value: 'delete' }
                ]"
                @select="$event.value === 'delete' ? deleteConfigs() : null"
            />
        </div>

        <ScrollBar>
            <ul v-if="!loading && configs?.length > 0">
                <TransitionGroup name="config">
                    <li v-for="(config, idx) of configs.filter(c => new RegExp(filters.text, 'g').test(c.name))" :key="config._id"
                        :class="{ selected: selected?.includes(config._id) }"
                    >
                        <Icon name="damage-void"/>
                        <div>
                            <div class="name">{{ config.name }}</div>
                            <div class="text"></div>
                        </div>

                        <div style="margin: 0 0 0 auto;"></div>

                        <Checkbox :value="config?.enable"
                            @mouseenter="setToolpic({ text: config?.enable ? 'Enabled' : 'Disabled' })"
                            @onEvent="enable(config?._id)"
                        />

                        <div class="l"></div>

                        <div class="user" :style="{ 'background-image': `url(${getAvatar({ nameId: config.user?._id })})` }"
                            @mouseenter="setToolpic({ text: config?.user?.nickname || config?.user?.username || config?.user?._id })"
                            @click="$windows.create({ component: 'User', data: config?.user?._id })"
                        ></div>

                        <div class="l"></div>

                        <ol>
                            <Icon name="pencil" style="--color: var(--yellow);"
                                @mouseenter="setToolpic({ text: 'Change config' })"
                                @click="changeConfig(config._id)"
                            />
                            <Icon name="trash" style="--color: var(--red);"
                                @mouseenter="setToolpic({ text: 'Delete config' })"
                                @click="selected = selected?.includes(config._id) ? selected.filter(c => c !== config._id) : [...selected || [], config?._id]"
                            />
                        </ol>
                    </li>
                </TransitionGroup>
            </ul>
            <Loading style="margin: 12px 0 0 0;" v-if="loading"/>
            <Alert style="margin: 12px 0 0 0;" type="mini" v-if="configs?.length < 1"/>
        </ScrollBar>
    </div>
</template>

<script lang="ts" setup>

import ScrollBar from '../../components/content/ScrollBar.vue';

import { getAvatar } from '../../libs/utils';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { mapActions } from 'vuex';

import Configs, { IConfig } from '../../libs/api/routes/configs';

import type { IMessage } from '../Message.vue';

export default defineComponent({
    name: 'WindowConfigs',
    components: {},
    computed: {},
    props: {
        windowId: { type: Number }
    },
    data: () => ({
        filters: {
            text: ''
        },
        configs: [] as Array<IConfig>,
        selected: [] as Array<string>,
        loading: true
    }),
    watch: {},
    methods: {
        ...mapActions(['setToolpic', 'setContextMenu']),
        async create() {
            const body = <IConfig>{};

            const data: IMessage = {
                title: 'Create new config',
                components: [
                    {
                        component: 'Textbox',
                        name: 'name',
                        props: {
                            label: 'Config name'
                        },
                        events: {
                            input(e: InputEvent) {
                                body.name = (e.target as any)?.value;
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        label: 'Create a miracle',
                        color: 'var(--green)',
                        click: async (e: MouseEvent, data: any, windowId: number) => {
                            const [newConfig, status] = await Configs.create(<IConfig>{ name: body.name });

                            if (status !== 200) return this.$notifications.error({
                                title: 'creating config',
                                message: (newConfig as any)?.message,
                                status
                            });

                            this.configs = [...this.configs || [], newConfig];

                            this.$windows.close(windowId);
                        }
                    }
                ]
            };

            this.$windows.create({
                component: 'Message',
                data
            });
        },
        async enable(configId: string) {
            const [result, status] = await Configs.enable(configId);

            if (status !== 200) return this.$notifications.error({
                title: 'enabling config',
                message: (result as any)?.message,
                status
            });

            for (let cfg of this.configs) {
                cfg.enable = cfg._id === configId;
            }
        },
        changeConfig(configId: string) {
            const configIndex = this.configs.findIndex(config => config._id === configId);

            if (configIndex < 0) return;
            
            this.$windows.create({
                component: 'ChangeConfig',
                data: {
                    id: this.configs[configIndex]._id,
                    save: async (newConfig: IConfig, type: 'update' | 'create', windowId: number) => {
                        const [result, status] = await Configs.update(this.configs[configIndex]._id, newConfig);

                        if (status !== 200) return this.$notifications.error({
                            title: 'updating config',
                            message: (result as any)?.message,
                            status
                        });

                        this.configs[configIndex] = newConfig;

                        this.$windows.close(windowId);
                    }
                }
            });
        },
        async deleteConfigs() {
            if (this.selected.length < 1) return;

            const [result, status] = await Configs.delete(this.selected);

            if (status !== 200) return this.$notifications.error({
                title: 'deleting config',
                message: (result as any)?.message,
                status
            });

            this.configs = this.configs.filter(c => !result.deleted.find(id => c._id === id));

            this.selected = [];
        }
    },
    async mounted() {
        const [list, status] = await Configs.list();

        if (status !== 200) {
            this.$notifications.error({
                title: 'loading configs',
                message: (list as any)?.message,
                status
            });

            this.loading = false;
        }

        this.loading = false;

        this.configs = list;
    }
});

</script>

<style lang="scss" scoped>

.config-enter-active,
.config-leave-active {
    transform: scale(.9);
    opacity: 0;
}

.block.configs {
    transition: all .2s;

    .title {
        font-size: 20px;
    }

    .filters {
        display: flex;
        margin: 12px 0 0 0;
        align-items: center;

        .ui-button {
            margin: 0 0 0 12px;
            max-width: 96px;
            min-width: 96px;
        }

        .ui-select {
            margin: 0 0 0 12px;
            max-width: 96px;
            min-width: 96px;
        }
    }

    ul {
        max-height: 256px;
        overflow-x: hidden;
        
        li {
            display: flex;
            margin: 12px 0 0 0;
            padding: 12px;
            max-width: 376px;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            align-items: center;
            transition: .2s;

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

            .user {
                cursor: pointer;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
                background-color: var(--background-secondary);
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
}

</style>