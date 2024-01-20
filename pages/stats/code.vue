<template>
    <div class="stats-code">
        <header>
            <Select label="Range"
                :value="'last_7_days'"
                :options="selectRange"

                @select="fetchStats($event.value)"
            />
        </header>

        <div class="stats" v-if="info && !listLoading.has('s')">
            <div>
                <div class="label">Total time</div>

                <span>
                    {{ info.totalTime.h }}<span>h</span>
                    {{ info.totalTime.m }}<span>m</span>
                    {{ info.totalTime.s }}<span>s</span>
                </span>

                <div class="alert">from {{ info.startDate }} to now</div>
            </div>

            <div>
                <div class="label">{{ stats?.range.replace(/_/g, ' ') }} time</div>

                <span>
                    {{ info.totalNow.h }}<span>h</span>
                    {{ info.totalNow.m }}<span>m</span>
                    {{ info.totalNow.s }}<span>s</span>
                </span>

                <div class="alert">from {{ time.format(stats?.start) }} to {{ time.format(stats?.end) }}</div>
            </div>
        </div>

        <Loading v-if="listLoading.has('s')"/>

        <div class="subtitle">{{ $t('language[1]') }}</div>

        <ul class="languages" v-if="stats && !listLoading.has('s')">
            <CardLanguage v-for="language of stats.languages" :key="language.name"
                :language="language"
            />
        </ul>

        <Loading v-if="listLoading.has('s')"/>

        <div class="subtitle">{{ $t('project[1]') }}</div>

        <div class="filters">
            <Textbox label="Search projects"
                :value="projectFilters.text"

                @update="projectFilters.text = $event"
            />

            <Button label=""
                :icon="`sort-amount-${projectFilters.order ? 'down' : 'up'}`"
                color="var(--background-secondary)"

                @click="projectFilters.order = !projectFilters.order"
            />

            <Select label="Sort by"
                :value="'updatedAt'"
                :options="selectSort"

                @select="projectFilters.sortType = $event.value"
            />
        </div>

        <ul class="projects" v-if="getListProjects.length > 0 && !listLoading.has('p')">
            <TransitionGroup name="transition-fade">
                <CardProject v-for="project of getListProjects" :key="project.id"
                    :project="project"
                />
            </TransitionGroup>
        </ul>

        <Loading v-if="listLoading.has('p')"/>
    </div>
</template>

<script lang="ts" setup>

import CardLanguage from '~/components/models/stats/Language.vue';
import CardProject from '~/components/models/stats/Project.vue';

import {
    type Project,
    type Stats,
    type TypeRange,
    type AllTimeSinceToday,
    listRangeTypes
} from '~/types/api/stats';


const { $api } = useNuxtApp();


const listLoading = ref(new Set<string>(['s', 'p']));


const
    allTime = ref<AllTimeSinceToday | null>(null),
    stats = ref<Stats | null>(null),
    projects = ref<Array<Project>>([]);

const
    projectFilters = ref({
        text: '',
        order: true,
        sortType: 'updatedAt'
    });


const selectRange = Object.values(listRangeTypes).map(type => ({
    label: type,
    value: type
}));

const selectSort = [
    {
        label: 'Name',
        icon: 'text-a',
        value: 'name'
    },
    {
        label: 'Changed At',
        icon: 'pencil',
        value: 'updatedAt'
    },
    {
        label: 'Created At',
        icon: 'clock-alt',
        value: 'createdAt'
    }
];


const info = computed(() => {
    if (!stats.value || !allTime.value) return null;

    const { total_seconds, range } = allTime.value;

    return {
        totalTime: secToHms(total_seconds),
        totalNow: secToHms(stats.value.total_seconds),
        startDate: time.format(range.start_date)
    }
});


const getListProjects = computed(() => {
    const { text, sortType } = projectFilters.value;

    const regex = new RegExp(text, 'gi');

    return projects.value
        .filter(({ name }) => regex.test(name))
        .sort((a, b) => {
            if (sortType === 'createdAt') return order(a.created_at < b.created_at);
            else if (sortType === 'updatedAt') return order(a.last_heartbeat_at < b.last_heartbeat_at);
            else if (sortType === 'name') return order(a.name > b.name);

            return 0;
        });
});



const order = (is: boolean) => {
    const { order } = projectFilters.value;

    return is ? (order ? 1 : -1) : (order ? -1 : 1);
}

async function fetchStats(range: TypeRange) {
    listLoading.value.add('s');

    const { ok, data } = await $api.stats.stats(range);
    
    listLoading.value.delete('s');

    if (!ok) return;

    stats.value = data;
}

async function fetchAllTimeSinceToday() {
    const { ok, data } = await $api.stats.allTimeSinceToday();

    if (!ok) return;

    allTime.value = data;
}

async function fetchListProjects() {
    listLoading.value.add('p');

    const { ok, data } = await $api.stats.projects();

    listLoading.value.delete('p');

    if (!ok) return;

    projects.value = data;
}

function secToHms(sec: number) {
    sec = Number(sec);

    return {
        h: Math.floor(sec / 3600),
        m: Math.floor(sec % 3600 / 60),
        s: Math.floor(sec % 3600 % 60)
    }
}



onMounted(() => {
    fetchStats('last_7_days');
    fetchAllTimeSinceToday();
    fetchListProjects();
});


definePageMeta({
    pageOptions: {
        padding: '0 20%',
    }
});

</script>

<style lang="scss" scoped>

.page.stats-code {
    padding: 0 20%;

    header {
        display: flex;
        margin-bottom: 12px;
        align-items: center;

        .ui-select {
            margin-left: auto;
            max-width: 196px;
        }
    }

    .stats {
        display: flex;
        margin-bottom: 24px;
        width: 100%;
        
        & > div {
            width: 100%;
            padding: 12px;
            border-radius: 7px;
            background-color: var(--background-secondary);

            &:nth-child(1) {
                margin-right: 12px;
            }

            &:nth-child(2) {
                margin-left: 12px;
            }

            .label {
                color: var(--text-secondary);
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
            }

            .label + * {
                font-size: 20px;
                
                span {
                    color: var(--text-secondary);
                    font-size: 12px;
                }
            }

            .alert {
                color: var(--text-secondary);
                font-size: 12px;
            }
        }
    }

    .subtitle {
        margin: 32px 0 12px 0;
        font-size: clamp(16px, var(--font), 32px);
    }

    .filters {
        display: flex;
        margin: 12px 0;
        // align-items: center;

        .ui-button {
            margin: 0 12px;
            min-width: max-content;

            :deep(.ui-icon) {
                margin: 0;
            }
        }

        .ui-select {
            max-width: 196px;
        }
    }

    ul.projects {
        .stats-project-card {
            &:not(:last-child) {
                margin-bottom: 1px;
            }

            &:first-child {
                border-radius: 5px 5px 0 0;
            }

            &:last-child {
                border-radius: 0 0 5px 5px;
            }
        }
    }
}

@media (max-width: 640px) {
    .page.stats-code {
        .stats {
            display: block !important;

            & > div {
                margin: 0 0 12px 0 !important;
                box-sizing: border-box;
            }
        }

        .filters {
            display: grid;
            grid-template-columns: 48px 1fr;
            grid-template-areas: 'textbox textbox'
                                 'button select';

            .ui-textbox {
                grid-area: textbox;
            }

            .ui-button {
                margin: 12px 12px 0 0;
                grid-area: button;
            }

            .ui-select {
                margin-top: 12px;
                max-width: 100%;
                grid-area: select;
            }
        }
    }
}

</style>