<template>
    <div class="stats-code">
        <div class="content">
            <ul class="stats">
                <li>
                    <header>
                        <Skeleton :show="!isLoading.languages" style="width: 96px; height: 25px;">
                            <div>
                                {{ secToHms(data.totalSeconds).h }}<span>h</span>
                                {{ secToHms(data.totalSeconds).m }}<span>m</span>
                                {{ secToHms(data.totalSeconds).s }}<span>s</span>
                            </div>
                        </Skeleton>

                        <Skeleton :show="!isLoading.languages && data?.createdAt?.length > 0" style="width: 96px; height: 16px;">
                            <div>from {{ time.format(data?.createdAt) }}</div>
                        </Skeleton>
                    </header>

                    <div class="bar" style="display: flex;">
                        <div v-for="editor in (editors as IEditor[])" :key="editor.name"
                            @mouseenter="toolpics.set({ name: editor.name.toLocaleLowerCase(), title: editor.name, position: 'bottom' })"
                            :style="{
                                width: `${editor.percent}%`,
                                'background-color': editor.color,
                                position: 'relative'
                            }"
                        ></div>
                    </div>
                </li>

                <li>
                    <header>
                        <Skeleton :show="!isLoading.projects && Boolean(getPercent)" style="width: 96px; height: 25px;">
                            <div>
                                {{ getPercent }}%
                            </div>
                        </Skeleton>

                        <Skeleton :show="!isLoading.projects" style="width: 96px; height: 16px;">
                            <div>
                                <span>{{ getTodayTime }}</span>
                                |
                                <span>{{ getYesterdayTime }}</span>
                            </div>
                        </Skeleton>
                    </header>

                    <div class="bar">
                        <div v-show="!isLoading.projects" :style="{ width: `${!isLoading?.languages ? getPercent : 0}%`, 'background-color': getPercent > 50 ? 'var(--green)' : 'var(--red)' }"></div>
                    </div>
                </li>
            </ul>

            <div class="subtitle">Languages</div>
            <ul class="languages">
                <StatsLang v-for="lang of languages" :key="lang.name" :lang="lang"/>

                <Loading v-if="isLoading.languages"/>
            </ul>

            <div class="subtitle">Projects</div>
            <ul class="projects">
                <StatsProject v-for="project of projects" :key="project.id"
                    :project="project"
                />

                <Loading v-if="isLoading.projects"/>
            </ul>
        </div>

        <div class="activity">
            Activity
            <!-- <PieChart/> -->
            <NavBar :orientation="'vertical'" :menu="editors.map((x: any) => ({
                label: x?.name,
                img: `https://wakatime.com/static/img/editor-icons/${x?.name?.toLocaleLowerCase().replace(/ /g, '-')}-128.png`
            }))" v-if="editors?.length > 0"/>
        </div>
    </div>
</template>

<script lang="ts" setup>

import NavBar from '~/components/content/NavBar.vue';

import StatsProject from '~/components/models/stats/Project.vue';
import StatsLang from '~/components/models/stats/Lang.vue';

import type { ILang, IProject, IEditor } from '~/types/api/stats';

const { $api } = useNuxtApp();

const
    toolpics = useToolpicsStore(),
    notifications = useNotificationsStore();

const
    isLoading = ref({
        languages: false,
        projects: false
    }),
    data = ref({
        totalSeconds: 0,
        todaySeconds: 0,
        yesterdaySeconds: 0,
        createdAt: ''
    }),
    editors = ref<Array<IEditor>>([]),
    projects = ref<Array<IProject>>([]),
    languages = ref<Array<ILang>>([]);



const getPercent = computed(() => {
    return Number(((data.value.todaySeconds / data.value.yesterdaySeconds) * 100).toFixed(2));
});

const getTodayTime = computed(() => {
    const { h, m, s } = secToHms(data.value.todaySeconds);

    return `${h}h ${m}m ${s}s`;
});

const getYesterdayTime = computed(() => {
    const { h, m, s } = secToHms(data.value.yesterdaySeconds);

    return `${h}h ${m}m ${s}s`;
});



async function getStats() {
    isLoading.value.languages = true;

    let [{ totalSeconds, todaySeconds, yesterdaySeconds, createdAt, editors: edits, languages: langs, message }, status] = await $api.get('/stats/code');

    if (status !== 200) return notifications.error({
        title: 'stats',
        message: message,
        status
    });

    data.value = {
        totalSeconds,
        todaySeconds,
        yesterdaySeconds,
        createdAt
    }
    
    editors.value = edits;
    languages.value = langs;

    isLoading.value.languages = false;
}

async function getProjects() {
    isLoading.value.projects = true;

    const [result, status] = await $api.get('/stats/code/projects');

    if (status !== 200) return notifications.error({
        title: 'stats',
        message: (result as any)?.message,
        status
    });

    projects.value = result.data;

    isLoading.value.projects = false;
}

function secToHms(sec: number) {
    sec = Number(sec);

    return {
        h: Math.floor(sec / 3600),
        m: Math.floor(sec % 3600 / 60),
        s: Math.floor(sec % 3600 % 60)
    }
}


useSeoMeta({
    title: 'Code | Stats'
});

definePageMeta({
    title: 'Stats',
    icon: 'stats',
    alias: [
        '/stats'
    ]
});


onMounted(() => {
    getStats();
    getProjects();
});

</script>


<style lang="scss" scoped>

.page.stats-code {
    display: flex;
    padding: 96px 10vw 0 10vw !important;
    min-height: 100vh;

    .subtitle {
        margin: 0 0 12px 0;
        font-size: clamp(16px, var(--font), 32px);
    }

    .content {
        margin: 0 32px 0 0;
        width: 100%;

        .stats {
            display: grid;
            margin: 0 0 32px 0;
            grid-template-columns: 1fr 1fr;

            li {
                &:nth-child(1) {
                    margin: 0 16px 0 0;
                }

                &:nth-child(2) {
                    margin: 0 0 0 16px;
                }

                header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    div:nth-child(1) {
                        font-size: 20px;
                        font-weight: 700;

                        span {
                            color: var(--text-secondary);
                            font-size: 12px;
                        }
                    }

                    div:nth-child(2) {
                        color: var(--text-secondary);
                        font-size: 12px;
                        
                        span {
                            font-size: 12px !important;
                        }
                    }
                }

                .bar {
                    margin: 8px 0 0 0;
                    width: 100%;
                    height: 8px;
                    position: relative;
                    border-radius: 5px;
                    background-color: var(--background-secondary);
                    overflow: hidden;

                    div {
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-color: var(--main-color);
                        transition: .2s;
                    }
                }
            }
        }
    }

    .activity {
        min-width: 20vw;
    }
}

</style>