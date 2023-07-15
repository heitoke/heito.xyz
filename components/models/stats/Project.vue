<template>
    <li class="stats-project" :class="{ active: isActive }">
        <header @click="open">
            <div class="image" :style="{
                'background-image': `url(${getAvatar({ nameId: project?.name, size: 64, type: 'bauhaus', colors: ['0b0b0b', '171717', project?.color?.slice(1) || $local.params?.color?.slice(1) || 'FFBF34'] })})`,
                '--color': project?.color || 'var(--background-primary)'
            }"></div>

            <div class="name">{{ project?.name }}</div>

            <div class="date">
                {{ project?.last_heartbeat_at ? 'changed' : 'created' }}
                {{ time.timeago(new Date((project?.last_heartbeat_at || project?.created_at) as string).valueOf()) }}
            </div>

            <Icon name="arrow-left"/>
        </header>

        <Height :showed="isActive">
            <div class="project-content">
                <ul>
                    <StatsLang v-for="lang of ((data as any)?.languages as ILang[])" :key="lang.name" :lang="lang"/>
                </ul>
    
                <Loading v-if="isLoading"/>
            </div>
        </Height>
    </li>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import StatsLang from './Lang.vue';

import type { ILang, IProject } from '~/types/api/stats';

const { $api } = useNuxtApp();

const notifications = useNotificationsStore();

const props = defineProps({
    project: { type: Object as PropType<IProject> }
});

const
    isActive = ref<boolean>(false),
    isLoading = ref<boolean>(false),
    data = ref({});


async function open() {
    if (isLoading.value) return;
    
    isActive.value = !isActive.value;

    if ((data.value as any)?.languages) return;

    isLoading.value = true;

    const [result, status] = await $api.get(`/stats/code/projects/${props.project?.name}?start=${new Date(Date.now() - 1209600000).toISOString()}&end=${new Date().toISOString()}`);

    if (status !== 200) {
        notifications.error({
            title: 'stats project',
            message: (result as any)?.message,
            status
        });

        return data.value = { error: true };
    }

    data.value = result;

    isLoading.value = false;
}

</script>


<style lang="scss" scoped>

.stats-project {
    margin: 0 0 1px 0;
    background-color: var(--background-primary-alt);
    overflow: hidden;

    &:first-child {
        border-radius: 5px 5px 0 0;
    }

    &:last-child {
        border-radius: 0 0 5px 5px;
    }

    &.active {
        header {
            background-color: var(--background-secondary);

            .hx-icon {
                transform: rotate(-90deg);
            }
        }
    }

    header {
        cursor: pointer;
        display: flex;
        padding: 12px 16px;
        align-items: center;
        transition: .2s;

        &:hover {
            background-color: var(--background-secondary);
        }
    
        .image {
            margin: 0 12px 0 0;
            width: 32px;
            height: 32px;
            border-radius: 5px;
            background-size: cover;
            background-position: center;
            background-color: var(--color);
        }

        .name {
            font-weight: 600;
        }

        .date {
            margin: 0 0 0 auto;
            color: var(--text-secondary);
            font-size: 12px;
        }

        .hx-icon {
            --color: var(--text-secondary);
            margin: 0 0 0 12px;
        }
    }

    .project-content {
        padding: 12px 16px;
        border-top: 1px solid var(--background-primary);
    }                
}

</style>