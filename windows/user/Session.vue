<template>
    <div class="session" v-if="session?._id">
        <div class="title">Session</div>

        <header>
            <Icon :name="deviceSession.os.icon || 'pacman'"
                :style="{
                    color: colors.altColor(colors.stringToHexColor(session._id)),
                    'background-color': colors.stringToHexColor(session._id)
                }"
            />

            <div>
                <div>{{ deviceSession.browser.name }}</div>
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
                <div>{{ session.type.replace(/_/g, ' ').toLocaleUpperCase() }}</div>
                <div>Token Type</div>
            </li>
        </ul>

        <Button color="var(--red)" @click="closeSession()">
            Close session
        </Button>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { ISession } from '~/types/api/auth';
import type { INameIcon } from '~/utils/device';

interface IDevice {
    os: INameIcon;
    browser: INameIcon;
}

const { $api } = useNuxtApp();

const
    notifications = useNotificationsStore(),
    windows = useWindowsStore();

const props = defineProps({
    windowId: { type: Number },
    data: {
        type: Object as PropType<{
            sessionId: string,
            close(sessionId: string): void
        }>
    }
});

const
    session = ref<ISession>({} as ISession),
    deviceSession = ref<IDevice>({} as IDevice);
    
    
async function loadSession(sessionId: string) {
    const [_session, status] = await $api.auth.session(sessionId);

    if (status !== 200) return notifications.error({
        title: 'session',
        message: (_session as any)?.message,
        status
    });

    session.value = _session;
    
    const info = device?.setUserAgent(_session.userAgent || '');

    deviceSession.value = {
        os: info?.os || {},
        browser: info?.browser || {}
    };
}

async function closeSession() {
    if (!session.value?._id) return;

    const [result, status] = await $api.auth.closeSessions(session.value._id);

    if (status !== 200) return notifications.error({
        title: 'session',
        message: (result as any)?.message,
        status
    });

    if (props.data?.close) props.data?.close(result?._id);

    windows.close(props.windowId!);
}


onMounted(() => {
    if (!props.data?.sessionId) return;

    loadSession(props.data?.sessionId!);
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