<template>
    <div class="list-configs">
        <div class="title">Configs</div>

        <div class="filters">
            <Button label="Create new config"
                style="width: 100%;"
                color="var(--green)"

                @click="createNewConfig"
            />
        </div>

        <ul v-if="!loading && list.length > 0">
            <li v-for="config of list" :key="config._id">
                <div class="name">{{ config?.name }}</div>

                <Checkbox v-if="!config.enabled"
                    :value="config.enabled"
                    :disabled="config.enabled || 'only-click'"

                    @mouseenter="$toolpic.show(config?.enabled ? 'Enabled' : 'Disabled')"
                    @click="config.enabled ? null : switchConfig(config._id)"
                />

                <div class="l"></div>

                <img :src="getDefaultImage(config.user._id)" alt="Config Author Avatar"
                    @mouseenter="$toolpic.show(config.user?.displayName || config.user?.username)"
                >

                <div class="l"></div>

                <Icon v-for="(btn, icon) in buttons" :key="icon"
                    :name="icon"
                    :style="{ '--color': btn.color }"

                    @click="btn.click(config._id)"
                    @mouseenter="$toolpic.show(btn.label)"
                />
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

import type { Config } from '~/types/api/config';


const { $api } = useNuxtApp();

const
    $toolpic = useToolpicStore(),
    $windows = useWindowsStore();


const props = defineProps<{
    windowId: number;
    close(): void;
}>();


const
    list = ref<Array<Config>>([]),
    loading = ref(false);


const buttons = {
    'pencil': {
        label: 'Change',
        color: 'var(--yellow)',
        click: openConfig
    },
    'trash': {
        label: 'Delete',
        color: 'var(--red)',
        click: deleteConfig
    }
}


async function fetchListConfigs() {
    loading.value = true;

    const { data, status } = await $api.configs.list();

    loading.value = false;

    if (status.value !== 'success') return;

    list.value = data.results;
}

function createNewConfig() {
    let name: string = '';

    const { id } = $windows.create('Message', {
        title: 'Create new config',
        components: [
            {
                name: 'name',
                component: 'Textbox',
                style: {
                    margin: '12px 0'
                },
                props: {
                    label: 'Config name'
                },
                events: {
                    update(newName: string) {
                        name = newName;
                    }
                }
            },
            {
                name: 'save',
                component: 'Button',
                style: {
                    width: '100%'
                },
                props: {
                    label: 'Create',
                    color: 'var(--green)'
                },
                events: {
                    click: async () => {
                        const { data, status } = await $api.configs.create(name);
                    
                        if (status.value !== 'success') return;

                        list.value.push(data);

                        $windows.close(id);
                    }
                }
            }
        ]
    });
}

async function switchConfig(configId: string) {
    const { data, status } = await $api.configs.switch(configId);

    if (status.value !== 'success') return;

    for (const config of list.value) {
        config.enabled = config._id === configId;
    }
}

function openConfig(configId: string) {
    $windows.create('AdminConfigsChange', {
        id: configId,
        save: () => {}
    })
}

async function deleteConfig(configId: string) {
    const index = list.value.findIndex(({ _id }) => _id === configId);

    if (index < 0) return;

    const config = list.value[index];

    const { id } = $windows.create('Message', {
        title: `Delete config: ${config.name}`,
        components: [
            {
                name: 'delete',
                component: 'Button',
                style: {
                    margin: '12px 0 0 0',
                    width: '100%'
                },
                props: {
                    label: 'Delete',
                    color: 'var(--red)'
                },
                events: {
                    click: async () => {
                        const { status } = await $api.configs.delete(config._id);

                        if (status.value !== 'success') return;

                        list.value.splice(index, 1);

                        $windows.close(id);
                    }
                }
            }
        ]
    })
}


onMounted(() => {
    fetchListConfigs();
});

</script>

<style lang="scss" scoped>

.list-configs {
    .title {
        font-size: 20px;
    }

    .filters {
        margin: 12px 0;
    }

    ul {
        max-height: 256px;
        overflow-x: hidden;

        li {
            display: flex;
            padding: 12px;
            max-width: 256px;
            width: 256px;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            align-items: center;
            transition: .2s;

            &:not(:last-child) {
                margin-bottom: 12px;
            }

            .name {
                margin-right: 8px;
                max-width: 100%;
                min-width: 0;
                flex: 1;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .l {
                margin: 0 8px;
                height: 16px;
                border-left: 1px solid var(--background-secondary);
            }

            img {
                cursor: pointer;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                object-fit: cover;
                object-position: center;
            }

            .ui-icon {
                cursor: pointer;
                color: var(--text-secondary);
                font-size: 14px;

                &:hover {
                    color: var(--color);
                }

                &:not(:last-of-type) {
                    margin-right: 8px;
                }
            }
        }
    }
}

</style>