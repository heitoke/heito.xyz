<template>
    <div :class="['stats-project-card', { active: isActive }]">
        <div class="header"
            @click="fetchProject"
        >
            <img :src="getDefaultImage(project.id, { type: 'bauhaus' })" alt="Project Image">

            <div class="name">{{ project.name }}</div>

            <div class="date">
                {{ project?.last_heartbeat_at ? 'changed' : 'created' }}
                {{ time.timeago(new Date(project?.last_heartbeat_at || project?.created_at)) }}
            </div>

            <div class="icon">
                <CircleSpinner v-if="isLoading"
                    :size="'16px'"
                />

                <Icon name="arrow-left" v-else/>
            </div>
        </div>

        <Height :show="data !== null && isActive">
            <div class="content">
                <div class="subtitle">{{ $t('language[1]') }}</div>

                <ul class="languages">
                    <CardLanguage v-for="language of data?.languages" :key="language.name"
                        :language="language"
                    />
                </ul>
            </div>
        </Height>
    </div>
</template>

<script lang="ts" setup>

import CircleSpinner from '~/components/models/other/CircleSpinner.vue';
import CardLanguage from './Language.vue';

import type { Stats, Project } from '~/types/api/stats';


const { $api } = useNuxtApp();


const props = defineProps<{
    project: Project;
}>();


const
    isActive = ref(false),
    isLoading = ref(false),
    data = ref<Stats | null>(null);


async function fetchProject() {
    isActive.value = !isActive.value;

    if (data.value) {
        return data.value;
    }

    isLoading.value = true;

    const { ok, data: project } = await $api.stats.stats('all_time', {
        project: props.project.name
    });

    isLoading.value = false;

    if (!ok) return;

    data.value = project;
}

</script>

<style lang="scss" scoped>

.stats-project-card {
    background-color: var(--background-primary-alt);
    overflow: hidden;
    
    &.active {
        .header {
            background-color: var(--background-secondary);

            .icon {
                color: var(--text-primary);
                transform: rotate(-90deg);
            }
        }
    }

    .header {
        cursor: pointer;
        display: flex;
        padding: 12px 16px;
        align-items: center;
        transition: .2s;

        &:hover {
            background-color: var(--background-secondary);
        }

        img {
            margin: 0 12px 0 0;
            width: 32px;
            height: 32px;
            border-radius: 5px;
            overflow: hidden;
        }

        .name {
            font-weight: 600;
        }

        .date {
            margin: 0 0 0 auto;
            color: var(--text-secondary);
            font-size: 12px;
        }

        .icon {
            color: var(--text-secondary);
            margin: 0 0 0 12px;
            transition: .2s;
        }
    }

    .content {
        padding: 12px 16px;
        border-top: 1px solid var(--background-primary);

        .subtitle {
            margin-bottom: 4px;
            color: var(--text-secondary);
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
    }
}


@media (max-width: 640px) {
    .stats-project-card {
        .header {
            display: grid;
            grid-template-columns: 44px 1fr 24px;
            grid-template-areas: 'img name icon'
                                 'img date icon';

            img {
                grid-area: img;
            }

            .name {
                grid-area: name;
            }

            .date {
                margin: 0;
                grid-area: date;
            }

            .icon {
                text-align: right;
                grid-area: icon;
            }
        }
    }
}

</style>