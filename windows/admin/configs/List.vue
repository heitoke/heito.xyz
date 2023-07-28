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
                        :class="{ selected: selected?.includes(config?._id) }"
                    >
                        <Icon name="damage-void"/>
                        <div>
                            <div class="name">{{ config.name }}</div>
                            <div class="text"></div>
                        </div>

                        <div style="margin: 0 0 0 auto;"></div>

                        <Checkbox :value="config?.enable"
                            @mouseenter="toolpics.set({ text: config?.enable ? 'Enabled' : 'Disabled' })"
                            @onEvent="enable(config?._id)"
                        />

                        <div class="l"></div>

                        <Image class="user"
                            :src="config.user?.avatar || getAvatar({ nameId: config.user?._id })"
                            @mouseenter="toolpics.set({ text: config?.user?.nickname || config?.user?.username || config?.user?._id })"
                            @click="windows.create({ component: 'UserProfile', data: config?.user?._id })"
                        />

                        <div class="l"></div>

                        <ol>
                            <Icon name="pencil" style="--color: var(--yellow);"
                                @mouseenter="toolpics.set({ text: 'Change config' })"
                                @click="changeConfig(config._id)"
                            />

                            <Icon name="trash" style="--color: var(--red);"
                                @mouseenter="toolpics.set({ text: 'Delete config' })"
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

import ScrollBar from '~/components/content/ScrollBar.vue';

import type { IConfig } from '~/types/api/config';

const { $api } = useNuxtApp();

const
    toolpics = useToolpicsStore(),
    contextMenu = useContextMenuStore(),
    windows = useWindowsStore(),
    notifications = useNotificationsStore();

const props = defineProps({
    windowId: { type: Number }
});

const
    filters = ref({ text: '' }),
    configs = ref<Array<IConfig>>([]),
    selected = ref<Array<string>>([]),
    loading = ref<boolean>(true);

async function loadListConfigs() {
    const [list, status] = await $api.configs.list();

    if (status !== 200) {
        notifications.error({
            title: 'loading configs',
            message: (list as any)?.message,
            status
        });

        return loading.value = false;
    }

    loading.value = false;

    configs.value = list;
}


async function create() {
    const body = {} as IConfig;

    windows.create({
        component: 'Message',
        data: {
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
                        const [newConfig, status] = await $api.configs.create(<IConfig>{ name: body.name });

                        if (status !== 200) return notifications.error({
                            title: 'creating config',
                            message: (newConfig as any)?.message,
                            status
                        });

                        configs.value = [...configs.value || [], newConfig];

                        windows.close(windowId);
                    }
                }
            ]
        }
    });
}

async function enable(configId: string) {
    const [result, status] = await $api.configs.enable(configId);

    if (status !== 200) return notifications.error({
        title: 'enabling config',
        message: (result as any)?.message,
        status
    });

    for (let cfg of configs.value) {
        cfg.enable = cfg._id === configId;
    }
}

async function changeConfig(configId: string) {
    const configIndex = configs.value.findIndex(config => config._id === configId);

    if (configIndex < 0) return;
    
    windows.create({
        component: 'AdminConfigsChange',
        data: {
            id: configs.value[configIndex]._id,
            save: async (newConfig: IConfig, type: 'update' | 'create', windowId: number) => {
                const [result, status] = await $api.configs.update(configs.value[configIndex]._id, newConfig);

                if (status !== 200) return notifications.error({
                    title: 'updating config',
                    message: (result as any)?.message,
                    status
                });

                configs.value[configIndex] = newConfig;

                windows.close(windowId);
            }
        }
    });
}

async function deleteConfigs() {
    if (selected.value.length < 1) return;

    const [result, status] = await $api.configs.delete(selected.value);

    if (status !== 200) return notifications.error({
        title: 'deleting config',
        message: (result as any)?.message,
        status
    });

    configs.value = configs.value.filter(config => !result.deleted.find(id => config._id === id));

    selected.value = [];
}


onMounted(() => {
    loadListConfigs();
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
}

</style>