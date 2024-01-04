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

        <section v-if="section === 'accounts'">
            <div class="filters">
                <Textbox label="Search"/>

                <Select label="Add account"
                    :options="listAccounts"
                />
            </div>
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

        <Button label="Save changes"
            style="width: 100%;"
        />
    </div>
</template>

<script lang="ts" setup>

import NavBar from '~/components/models/content/NavBar.vue';

import { type Config, AccountType } from '~/types/api/config';


const { $api } = useNuxtApp();


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
    { label: 'Discord', icon: 'discord', value: AccountType.Discord, name: 'User ID' }
]


async function fetchConfig(configId: string) {
    const { data, status } = await $api.configs.get(configId);

    if (status.value !== 'success') return;

    config.value = data;
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
        max-height: 256px;
        overflow-x: hidden;
    }

    .filters {
        display: flex;
        align-self: center;

        .ui-textbox {
            margin-right: 12px;
        }
    }
}

</style>