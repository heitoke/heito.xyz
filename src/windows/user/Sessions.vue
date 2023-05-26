<template>
    <div class="sessions">
        <div class="title">Sessions</div>

        <NavBar style="margin: 0 0 12px 0;" :menu="[
            { label: 'All', icon: 'damage-void', value: 'all' },
            ...[getSessions.find(s => s.type === ESessionType.GuastToken) ? { label: 'Guast token', icon: 'user-circle', value: ESessionType.GuastToken } : {} as any],
            ...[getSessions.find(s => s.type === ESessionType.Refresh) ? { label: 'Refresh token', icon: 'setting', value: ESessionType.Refresh } : {} as any],
            ...[getSessions.find(s => s.type === ESessionType.Access) ? { label: 'Access token', icon: 'exit', value: ESessionType.Access } : {} as any]
        ]" @select="filters.type = $event.value!"/>

        <ScrollBar :max-height="'256px'">
            <ul v-if="!loading && getSessions?.length > 0">
                <TransitionGroup name="fade">
                    <li v-for="session of getSessions" :key="session._id"
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
                </TransitionGroup>
            </ul>
            <Loading v-if="loading"/>
            <Alert v-if="getSessions.length < 1" type="mini"/>
        </ScrollBar>
    </div>
</template>

<script lang="ts" setup>

import ScrollBar from '../../components/ScrollBar.vue';

import NavBar from '../../components/content/NavBar.vue';

import { colors, time } from '../../libs/utils';

</script>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import Auth, { type ISession, ESessionType } from '../../libs/api/routes/auth';

import { device, type INameIcon } from '../../libs/utils';

interface Session extends ISession {
    device: {
        os: INameIcon;
        browser: INameIcon;
    }
}

export default defineComponent({
    name: 'WindowSessions',
    components: {},
    computed: {
        getSessions() {
            return this.sessions.filter(session => this.filters.type === 'all' ? true : session.type === this.filters.type);
        }
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
        ESessionType,
        filters: {
            type: 'all'
        },
        sessions: [] as Array<Session>,
        loading: true
    }),
    watch: {},
    methods: {
        async loadSessions() {
            const [sessions, status] = await Auth.sessions();

            if (status !== 200) return this.$notifications.error({
                title: 'sessions',
                message: (sessions as any)?.message,
                status
            });

            this.loading = false;

            this.sessions = <Array<Session>>sessions.map(session => {
                const info = device?.setUserAgent(session.userAgent);

                return {
                    ...session,
                    device: {
                        os: info?.os || {},
                        browser: info?.browser || {}
                    }
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

.fade-enter-active,
.fade-leave-active {
    transition: .2s;
    opacity: 0;
}

.block.sessions {
    max-width: 256px;

    .title {
        margin: 0 0 12px 0;
        font-size: 18px;
    }

    ul {
        padding: 4px;

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