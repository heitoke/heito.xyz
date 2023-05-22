<template>
    <div class="api-route-data">
        <div style="margin: 0 12px 0 0;">
            <div v-if="route?.params" style="margin: 0 0 12px 0;">
                <div class="subtitle" @click="hideBlock('params')">Path parameters</div>

                <ul class="queries" v-if="!hide.includes('params')">
                    <li v-for="query of route?.params" :key="query.name">
                        <div class="name">
                            <span>{{ query.name }}</span>
                            - {{ query?.type }}
                            <div>Required</div>
                        </div>
                        
                        <div class="text">{{ query?.text }}</div>
                    </li>
                </ul>
            </div>

            <div v-if="route?.body" style="margin: 0 0 12px 0;">
                <div class="subtitle" @click="hideBlock('queries')">Query parameters</div>

                <ul class="queries" v-if="!hide.includes('queries')">
                    <li v-for="query of route?.queries" :key="query.name">
                        <div class="name">
                            <span>{{ query.name }}</span>
                            - {{ query?.type }}
                            <div v-if="query?.required">Required</div>
                        </div>
                        
                        <div class="text">{{ query?.text }}</div>
                    </li>
                </ul>
            </div>

            <div v-if="route?.body">
                <div class="subtitle" @click="hideBlock('body')">Body</div>

                <ul class="queries" v-if="!hide.includes('body')">
                    <li v-for="query of route?.body" :key="query.name">
                        <div class="name">
                            <span>{{ query.name }}</span>
                            - {{ query?.type }}
                            <div v-if="query?.required">Required</div>
                        </div>
                        
                        <div class="text">{{ query?.text }}</div>
                    </li>
                </ul>
            </div>
        </div>

        <div style="margin: 0 0 0 12px;">
            <div v-if="route?.statuses" style="margin: 0 0 12px 0;">
                <div class="subtitle" @click="hideBlock('statuses')">Status codes</div>

                <ul class="queries" v-if="!hide.includes('statuses')">
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
                        @mouseenter="setToolpic({ text: per.text })"    
                    >
                        <Icon :name="per.icon"/>
                        <div>{{ per.label }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { mapActions } from 'vuex';

import type { ICategory, IRoute } from '../../libs/api';
import { listPermissions } from '../../libs/api/routes/users';

export default defineComponent({
    name: 'APIRouteData',
    computed: {},
    props: {
        route: {
            type: Object as PropType<IRoute>
        }
    },
    data: () => ({
        hide: [] as Array<string>,
        listPermissions
    }),
    watch: {},
    methods: {
        ...mapActions(['setToolpic']),
        hideBlock(name: string) {
            this.hide = this.hide?.includes(name) ? this.hide.filter(s => s !== name) : [...this.hide || [], name];
        }
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.api-route-data {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .subtitle {
        cursor: pointer;
        margin: 0 0 4px 0;
        color: var(--text-secondary);
        font-size: 12px;
        text-transform: uppercase;
        user-select: none;
    }

    ul.queries {
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