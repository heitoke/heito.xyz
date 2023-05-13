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
                {{ timeago(new Date((project?.last_heartbeat_at || project?.created_at) as string).valueOf()) }}
            </div>
            <Icon name="arrow-left"/>
        </header>
        <div class="project-content" v-if="isActive">
            <ul>
                <StatsLang v-for="lang of ((data as any)?.languages as ILang[])" :key="lang.name" :lang="lang"/>
            </ul>
            <Loading v-if="isLoading"/>
        </div>
    </li>
</template>

<script lang="ts" setup>

import StatsLang, { ILang } from './Lang.vue';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import $api from '../../libs/api';

import { getAvatar, timeago } from '../../libs/functions';

export interface IProject {
    badge: null;
    clients: Array<Object>;
    color: string | null;
    created_at: string;
    has_public_url: boolean;
    human_readable_last_heartbeat_at: string;
    id: string;
    last_heartbeat_at: string;
    name: string;
    repository: any,
    url: string;
    urlencoded_name: string;

    isActive: boolean;
    isLoading: boolean;
    data: object;
}

export default defineComponent({
    name: 'StatsProject',
    components: {},
    computed: {},
    props: {
        project: Object as PropType<IProject>
    },
    data: () => ({
        isActive: false,
        isLoading: false,
        data: {}
    }),
    watch: {},
    methods: {
        getAvatar, timeago,
        async open() {
            this.isActive = !this.isActive;

            console.log(this.data);
            

            if ((this?.data as any)?.languages) return;

            this.isLoading = true;

            let [result, status] = await $api.get(`/stats/code/projects/${this.project?.name}?start=${new Date(Date.now() - 1209600000).toISOString()}&end=${new Date().toISOString()}`);
        
            if (status !== 200) return this.data = { error: true };

            this.data = result;

            this.isLoading = false;
        }
    },
    async mounted() {
    }
});

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