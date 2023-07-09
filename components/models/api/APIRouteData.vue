<template>
    <div class="api-route-data">
        <div style="margin: 0 12px 0 0;">
            <div v-if="route?.params" style="margin: 0 0 12px 0;">
                <div class="subtitle" @click="hideBlock('params')">Path parameters</div>

                <RouteQueries :queries="route?.params" :all-required="true" v-if="!hide.includes('params')"/>
            </div>

            <div v-if="route?.queries" style="margin: 0 0 12px 0;">
                <div class="subtitle" @click="hideBlock('queries')">Query parameters</div>

                <RouteQueries :queries="route?.queries" v-if="!hide.includes('queries')"/>
            </div>

            <div v-if="route?.body">
                <div class="subtitle" @click="hideBlock('body')">Body [JSON]</div>

                <RouteQueries :queries="route?.body" v-if="!hide.includes('body')"/>
            </div>
        </div>

        <div style="margin: 0 0 0 12px;">
            <div v-if="route?.statuses" style="margin: 0 0 12px 0;">
                <div class="subtitle" @click="hideBlock('statuses')">Status codes</div>

                <ul class="statuses" v-if="!hide.includes('statuses')">
                    <li v-for="status of route.statuses" :key="status.code">
                        <div class="code">{{ status.code }}</div>
                        <div class="text">{{ status.text }}</div>
                    </li>
                </ul>
            </div>

            <div v-if="route?.permissions">
                <div class="subtitle" @click="hideBlock('permissions')">Permissions</div>

                <ul class="permissions" v-if="!hide?.includes('permissions')">
                    <li v-for="per of listPermissions?.filter(per => route?.permissions?.find(p => p === per.value))" :key="per.value"
                        @mouseenter="toolpics.set({ text: per.text })"    
                    >
                        <Icon :name="per.icon"/>
                        <div>{{ per.label }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import RouteQueries from './RouteQueries.vue';

import type { ICategory, IRoute } from '~/types/api';
import { listPermissions } from '~/types/api/user';

const toolpics = useToolpicsStore();

const props = defineProps({
    route: { type: Object as PropType<IRoute> }
});

const hide = ref<Array<string>>([]);


function hideBlock(name: string) {
    hide.value = hide.value?.includes(name) ? hide.value.filter(s => s !== name) : [...hide.value || [], name];
}

</script>

<style lang="scss" scoped>

.api-route-data {
    display: grid;
    position: relative;
    grid-template-columns: 50% 50%;

    .subtitle {
        cursor: pointer;
        margin: 0 0 4px 0;
        color: var(--text-secondary);
        font-size: 12px;
        text-transform: uppercase;
        user-select: none;
    }

    .statuses {
        padding: 12px;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);

        li {
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

            .code {
                font-weight: 700;
                font-size: 16px;
            }

            .text {
                margin: 4px 0 0 0;
                color: var(--text-secondary);
                font-size: 13px;
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