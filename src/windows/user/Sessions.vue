<template>
    <div class="sessions">
        <div class="title">Sessions</div>

        <ScrollBar :max-height="'256px'">
            <ul>
                <li v-for="session of sessions" :key="session._id"
                    @click="openSession(session._id)"
                >
                    <Icon :name="session.device.os.icon || 'pacman'"
                        :style="{
                            color: colors.altColor(colors.stringToHexColor(session._id)),
                            'background-color': colors.stringToHexColor(session._id)
                        }"
                    />
                    <div>
                        <div class="name">
                            <div>{{ session.device.browser.name }}</div>
                            <div>{{ time.format(String(session.createdAt)) }}</div>
                        </div>
                        <div class="ip">{{ session.ip }}</div>
                    </div>
                </li>
            </ul>
        </ScrollBar>
    </div>
</template>

<script lang="ts" setup>

import ScrollBar from '../../components/ScrollBar.vue';

import { colors, time, device, type INameIcon } from '../../libs/utils';

</script>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import Auth, { type ISession } from '../../libs/api/routes/auth';

interface Session extends ISession {
    device: {
        os: INameIcon;
        browser: INameIcon;
    }
}

export default defineComponent({
    name: 'WindowSessions',
    components: {},
    computed: {},
    props: {
        windowId: { type: Number },
        closeWindow: {
            type: Function,
            default: () => 1
        },
        data: { type: Object as PropType<{ userId: string, token: string }> }
    },
    data: () => ({
        sessions: [] as Array<Session>
    }),
    watch: {},
    methods: {
        async loadSessions() {
            const [sessions, status] = await Auth.sessions();

            if (status !== 200) return;

            this.sessions = <Array<Session>>sessions.map(session => {
                const _device = device.setUserAgent(session.userAgent);

                return {
                    ...session,
                    device: _device
                }
            });
        },
        openSession(sessionId: string) {
            this.$windows.create({
                component: 'Session',
                data: {
                    sessionId,
                    close: (id: string) => {
                        this.sessions = this.sessions.filter(session => session._id !== id);
                    }
                }
            })
        }
    },
    mounted() {
        this.loadSessions();
    }
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
                min-width: 32px;
                height: 32px;
                font-size: 20px;
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