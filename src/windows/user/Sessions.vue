<template>
    <div class="sessions">
        <div class="title">Sessions</div>

        <ScrollBar :max-height="'256px'">
            <ul>
                <li v-for="session of sessions" :key="session._id">
                    <Icon name="linux" :style="{ color: getAltColor(stringToHexColor(session._id)), 'background-color': stringToHexColor(session._id) }"/>
                    <div>
                        <div class="name">
                            <div>Firefox 106</div>
                            <div>25.05.2023</div>
                        </div>
                        <div class="ip">97.132.45.143</div>
                    </div>
                </li>
            </ul>
        </ScrollBar>
    </div>
</template>

<script lang="ts" setup>

import ScrollBar from '../../components/ScrollBar.vue';

import { stringToHexColor, getAltColor } from '../../libs/functions';

</script>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import Auth from '../../libs/api/routes/auth';

export default defineComponent({
    name: 'WindowCreateAccount',
    components: {},
    computed: {
        ...mapGetters([]),
    },
    props: {
        windowId: { type: Number },
        closeWindow: {
            type: Function,
            default: () => 1
        },
        data: { type: Object as PropType<{ userId: string, token: string }> }
    },
    data: () => ({
        sessions: new Array(10).fill({ _id: 'ddw' })
    }),
    watch: {},
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

.block.sessions {
    .title {
        margin: 0 0 12px 0;
        font-size: 18px;
    }

    ul {
        padding: 4px;
        min-width: 256px;

        li {
            cursor: pointer;
            display: flex;
            margin: 0 0 12px 0;
            padding: 8px 12px;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            align-items: center;
            transition: .2s;

            &:active {
                transform: scale(.97);
            }

            &:last-child {
                margin: 0;
            }

            &:hover {
                box-shadow: 0 0 0 3px var(--main-color-alt);
                border-color: var(--main-color);
                background-color: var(--background-secondary);
            }

            i {
                display: flex;
                min-width: 28px;
                height: 28px;
                border-radius: 5px;
                align-items: center;
                justify-content: center;
                // mix-blend-mode: multiply;
                background-color: var(--main-color);
            }

            i + div {
                margin: 0 0 0 8px;
                width: 100%;

                .name {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    div:nth-child(2) {
                        color: var(--text-secondary);
                        font-size: 10px;
                    }
                }

                .ip {
                    color: var(--text-secondary);
                    font-size: 11px;
                }
            }
        }
    }
}

</style>