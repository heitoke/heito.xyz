<template>
    <div class="stats-language">
        <img :src="getImage" alt="Language Image">

        <div class="name">{{ language.name }}</div>

        <div style="margin-left: auto;"></div>

        <div class="text">
            {{ language?.hours }}<span>h</span>
            {{ language?.minutes }}<span>m</span>
            {{ language?.seconds || 0 }}<span>s</span>
        </div>

        <div class="bar">
            <div :style="{ width: `${language.percent}%` }"></div>
        </div>

        <div class="text">
            {{ language.percent.toFixed(2) }}
            <span>%</span>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { replaceImageLanguage, type Language } from '~/types/api/stats';

const props = defineProps<{
    language: Language;
}>();


const getImage = computed(() => {
    if (!props.language) return '';

    const name = props.language.name.split('.')[0].toLocaleLowerCase();

    return `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/${replaceImageLanguage[name] || name}.svg`;
});

</script>


<style lang="scss" scoped>

.stats-language {
    display: flex;
    margin: 0 0 8px 0 !important;
    max-width: 100%;
    align-items: center;

    .l {
        margin: 0 8px;
        height: 28px;
        border-left: 1px solid var(--background-secondary-alt);
    }

    img {
        margin: 0 12px 0 0;
        width: 32px;
        height: 32px;
        font-size: 0;
        border-radius: 5px;
        object-fit: cover;
        object-position: center;
    }

    .name {
        max-width: 100%;
        min-width: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        flex: 1;
    }

    .text {
        font-size: 14px;
        span {
            color: var(--text-secondary);
            font-size: 10px;
        }
    }

    .bar {
        margin: 0 8px;
        max-width: clamp(64px, 25%, 256px);
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

</style>