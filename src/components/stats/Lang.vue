<template>
    <div class="stats-language">
        <div class="image" :style="{
            'background-image': `url(https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/${lang?.name?.split('.')[0].toLocaleLowerCase()}.svg)`
        }"></div>
        <div class="name">{{ lang?.name }}</div>
        <div class="l"></div>
        <div style="width: 56px; color: var(--text-secondary);">{{ lang?.percent }}%</div>
        <div class="bar">
            <div :style="{ width: `${lang?.percent}%` }"></div>
        </div>
        <div class="l"></div>
        <div class="time">
            {{ lang?.hours }}<span>h</span>
            {{ lang?.minutes }}<span>m</span>
            {{ lang?.seconds || 0 }}<span>s</span>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

export interface ILang {
    decimal: string;
    digital: string;
    hours: number;
    minutes: number;
    name: string;
    percent: number;
    seconds: number;
    text: string;
    total_seconds: number;
}

export default defineComponent({
    name: 'StatsLanguage',
    components: {},
    computed: {},
    props: {
        lang: Object as PropType<ILang>
    },
    data: () => ({}),
    watch: {},
    methods: {},
    async mounted() {}
});

</script>


<style lang="scss" scoped>

.stats-language {
    display: flex;
    margin: 0 0 8px 0 !important;
    align-items: center;

    .l {
        margin: 0 8px;
        height: 28px;
        border-left: 1px solid var(--background-secondary-alt);
    }

    .image {
        margin: 0 12px 0 0;
        width: 32px;
        height: 32px;
        border-radius: 5px;
        background-size: cover;
        background-position: center;
    }

    .name {
        max-width: 169px;
        width: 169px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .bar {
        margin: 4px 0 0 0;
        width: 256px;
        height: 8px;
        position: relative;
        border-radius: 5px;
        background-color: var(--background-primary);
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

    .time {
        span {
            color: var(--text-secondary);
            font-size: 10px;
        }
    }
}

</style>