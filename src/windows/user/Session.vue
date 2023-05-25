<template>
    <div class="session" v-if="session?._id">
        <div class="title">Session</div>

        <header>
            <Icon :name="device.os.icon || 'pacman'"
                :style="{
                    color: colors.altColor(colors.stringToHexColor(session._id)),
                    'background-color': colors.stringToHexColor(session._id)
                }"
            />
            <div>
                <div>{{ device.browser.name }}</div>
                <div>{{ time.format(String(session.createdAt), 'dd MMM YYYY in hh:mm:ss') }}</div>
            </div>
        </header>

        <ul>
            <li>
                <div>{{ session.ip }}</div>
                <div>IP</div>
            </li>
            <li>
                <div>{{ session.userAgent }}</div>
                <div>User Agent</div>
            </li>
            <li>
                <div>{{ session.type.toLocaleUpperCase() }}</div>
                <div>Token Type</div>
            </li>
        </ul>

        <Button color="var(--red)"
            @click="close()"
        >Close session</Button>
    </div>
</template>

<script lang="ts" setup>

import { colors, time } from '../../libs/utils';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import Auth, { type ISession } from '../../libs/api/routes/auth';

import { device, type INameIcon } from '../../libs/utils';

interface IDevice {
    os: INameIcon;
    browser: INameIcon;
}

export default defineComponent({
    name: 'WindowSession',
    components: {},
    computed: {},
    props: {
        windowId: { type: Number },
        closeWindow: {
            type: Function,
            default: () => 1
        },
        data: {
            type: Object as PropType<{
                sessionId: string,
                close(sessionId: string): void
            }>
        }
    },
    data: () => ({
        session: {} as ISession,
        device: {} as IDevice
    }),
    watch: {},
    methods: {
        async loadSession(sessionId: string) {
            const [session, status] = await Auth.session(sessionId);

            if (status !== 200) return;

            this.session = session;
            
            const info = device?.setUserAgent(this.session.userAgent || '');

            this.device = {
                os: info?.os || {},
                browser: info?.browser || {}
            };
        },
        async close() {
            if (!this.session?._id) return;

            const [session, status] = await Auth.closeSessions(this.session._id);

            if (status !== 200) return;

            if (this.data?.close) this.data?.close(this.session._id);

            this.$windows.close(this.windowId!);
        }
    },
    mounted() {
        if (!this.data?.sessionId) return;

        this.loadSession(this.data?.sessionId);
    }
});

</script>

<style lang="scss" scoped>

.block.session {
    min-width: 256px;

    .title {
        margin: 0 0 12px 0;
        font-size: 18px;
    }

    header {
        display: flex;
        border-radius: 5px;
        align-items: center;
        transition: .2s;

        i {
            display: flex;
            min-width: 48px;
            height: 48px;
            font-size: 28px;
            border-radius: 5px;
            align-items: center;
            justify-content: center;
            // mix-blend-mode: multiply;
            background-color: var(--main-color);
        }

        i + div {
            margin: 0 0 0 8px;
            width: 100%;

            div:nth-child(1) {
                font-size: 16px;
            }

            div:nth-child(2) {
                color: var(--text-secondary);
                font-size: 12px;
            }
        }
    }

    ul {
        margin: 12px 0;

        li {
            margin: 0 0 12px 0;
            padding: 0 0 12px 0;
            border-bottom: 1px solid var(--background-secondary);

            &:last-child {
                margin: 0;
                padding: 0;
                border: none;
            }

            div {
                max-width: 256px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;

                &:nth-child(2) {
                    margin: 2px 0 0 0;
                    color: var(--text-secondary);
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
            }
        }
    }
}

</style>