<template>
    <ul class="queries">
        <li class="query" v-for="query of queries" :key="query.name">
            <div class="name">
                <span>{{ query.name }}</span>
                - {{ query?.type }}
                <div v-if="allRequired || query?.required">Required</div>
            </div>

            <div v-if="Object.keys(query?.enum || {})?.length > 0">
                <div class="subtitle">Enum</div>

                <NavBar :menu="(Array.isArray(query?.enum) ? query?.enum : Object.keys(query?.enum!)).map(x => ({ label: x }))"/>

                <!-- <ol class="enum" v-if="Object.keys(query?.enum || {})?.length > 0">
                    <li v-for="e of ((query?.enum?.length as any) > 0 ? query?.enum : Object.keys(query?.enum!))">
                        <div class="name">
                            <span>{{ e }}</span>
                        </div>
                    </li>
                </ol> -->
            </div>

            <div class="default" v-if="query?.default">{{ query.default }}</div>
            
            <div class="text">{{ query?.text }}</div>

            <div v-if="query?.permissions?.length! > 0">
                <div class="subtitle" style="cursor: default;">Permissions</div>
                
                <ul class="permissions">
                    <li v-for="per of listPermissions?.filter(per => query?.permissions?.find(p => p === per.value))" :key="per.value"
                        @mouseenter="toolpics.set({ text: per.text })"    
                    >
                        <Icon :name="per.icon"/>
                        <div>{{ per.label }}</div>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import NavBar from '~/components/content/NavBar.vue';

import type { ICategory, IQuery, IRoute } from '~/types/api';
import { listPermissions } from '~/types/api/user';

const toolpics = useToolpicsStore();

const props = defineProps({
    queries: {
        type: Object as PropType<Array<IQuery>>,
        default: () => []
    },
    allRequired: {
        type: Boolean,
        default: false
    }
});

</script>

<style lang="scss" scoped>

.queries {
    padding: 12px;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);

    .subtitle {
        margin: 0 0 4px 0;
        color: var(--text-secondary);
        font-size: 10px;
        text-transform: uppercase;
        user-select: none;
    }

    li.query {
        margin: 12px 0 0 0;
        padding: 0 0 12px 0;
        border-bottom: 1px solid var(--background-secondary);

        &:first-child {
            margin: 0;
        }

        &:last-child {
            padding: 0;
            border: none;
        }

        .text {
            margin: 4px 0 0 0;
            color: var(--text-secondary);
            font-size: 13px;
        }

        .name {
            display: flex;
            color: var(--text-secondary);
            align-items: center;

            span {
                margin: 0 4px 0 0;
                color: var(--text-primary);
                font-weight: 700;
            }
        
            div {
                margin: 0 0 0 8px;
                padding: 4px 8px;
                color: var(--yellow);
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                border-radius: 5px;
                background-color: var(--yellow-alpha);
            }
        }

        .default {
            margin: 4px 0 0 0;
            padding: 4px 8px;
            width: max-content;
            border-radius: 5px;
            background-color: var(--background-secondary);

            &::before {
                content: "Default: ";
                color: var(--text-secondary);
                font-size: 12px;
            }
        }

        :deep(.nav-bar) {
            padding: 2px 0;

            div {
                border: 1px solid var(--background-secondary);
                background-color: var(--T);
            }
        }

        ol.enum {
            display: flex;
            margin: 4px 0 0 0;
            padding: 0 0 4px 0;
            // border-radius: 5px;
            border-bottom: 2px dashed var(--background-secondary);
            
            li {
                margin: 0 4px 0 0;
                padding: 4px 8px;
                width: max-content;
                border-radius: 5px;
                border: 1px solid var(--background-secondary);
                // background-color: var(--background-secondary);

                &:last-child {
                    margin: 0;
                }

                .name {
                    span {
                        margin: 0;
                    }
                }
            }
        }
    }

    ul.permissions {
        display: flex;
        margin: 8px 0 0 0;
        align-items: center;
        flex-wrap: wrap;

        li {
            display: flex;
            margin: 0 8px 0 0;
            padding: 6px 12px;
            position: relative;
            color: var(--text-secondary);
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            align-items: center;
            user-select: none;

            &:last-child {
                margin: 0;
            }

            i {
                margin: 0 8px 0 0;
                font-size: 14px;
            }

            span {
                font-size: 12px;
            }
        }
    }
}

</style>