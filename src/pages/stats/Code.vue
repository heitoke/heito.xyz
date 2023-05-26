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
                            @mouseenter="setToolpic({ name: editor.name.toLocaleLowerCase(), title: editor.name, position: 'bottom' })"
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
                        <Skeleton :show="!isLoading.projects && getPercent" style="width: 96px; height: 25px;">
                            <div>
                                {{ getPercent }}%
                            </div>
                        </Skeleton>
                        <Skeleton :show="!isLoading.projects" style="width: 96px; height: 16px;">
                            <div>
                                <span>
                                    {{ secToHms(data.todaySeconds).h }}h
                                    {{ secToHms(data.todaySeconds).m }}m
                                    {{ secToHms(data.todaySeconds).s }}s
                                </span>
                                |
                                <span>
                                    {{ secToHms(data.yesterdaySeconds).h }}h
                                    {{ secToHms(data.yesterdaySeconds).m }}m
                                    {{ secToHms(data.yesterdaySeconds).s }}s
                                </span>
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
                <StatsLang v-for="lang in (languages as ILang[])" :key="lang.name" :lang="lang"/>
                <Loading v-if="isLoading.languages"/>
            </ul>
            <div class="subtitle">Projects</div>
            <ul class="projects">
                <StatsProject v-for="project in (projects as IProject[])" :key="project.id"
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

import NavBar from '../../components/content/NavBar.vue';
import StatsProject, { IProject } from '../../components/stats/Project.vue';
import StatsLang, { ILang } from '../../components/stats/Lang.vue';
// import PieChart from '../../components/content/PieChart.vue';

import { time } from '../../libs/utils';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions } from 'vuex';

import $api from '../../libs/api';

interface IEditor {
    decimal: string;
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    text: string;
    total_seconds: number;
    color: string;
}

export default defineComponent({
    name: 'StatsCodePage',
    components: {},
    computed: {
        getPercent() {
            return Number(((this.data.todaySeconds / this.data.yesterdaySeconds) * 100).toFixed(2))
        }
    },
    data: () => ({
        isLoading: {
            languages: false,
            projects: false
        },
        data: {
            totalSeconds: 0,
            todaySeconds: 0,
            yesterdaySeconds: 0,
            createdAt: ''
        },
        editors: [],
        projects: [],
        languages: []
    }),
    watch: {},
    methods: {
        ...mapActions(['setToolpic']),
        async getStats() {
            this.isLoading.languages = true;
        
            let [{ totalSeconds, todaySeconds, yesterdaySeconds, createdAt, editors, languages, message }, status] = await $api.get('/stats/code');

            if (status !== 200) return this.$notifications.error({
                title: 'stats',
                message: message,
                status
            });

            this.data = {
                totalSeconds,
                todaySeconds,
                yesterdaySeconds,
                createdAt
            }
            this.editors = editors;
            this.languages = languages;

            this.isLoading.languages = false;

            console.log(this.data);
            
        },
        async getProjects() {
            this.isLoading.projects = true;
        
            const [result, status] = await $api.get('/stats/code/projects');

            if (status !== 200) return this.$notifications.error({
                title: 'stats',
                message: (result as any)?.message,
                status
            });

            this.projects = result.data;

            this.isLoading.projects = false;
        },
        secToHms(sec: number) {
            sec = Number(sec);

            return {
                h: Math.floor(sec / 3600),
                m: Math.floor(sec % 3600 / 60),
                s: Math.floor(sec % 3600 % 60)
            }
        }
    },
    async mounted() {
        this.getStats();
        this.getProjects();
    }
})

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