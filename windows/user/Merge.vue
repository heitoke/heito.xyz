<template>
    <div class="merge">
        <section v-if="section === 0">
            <Text class="title" text="Two accounts found"/>

            <Text class="text" text="Since you have already logged in to our site and your IP has changed, we think it would be nice to combine these two accounts into one. Please choose which account will be the main one."/>
            
            <User :user="mainUser" :clicked="false" :class="{ active: main === mainUser._id }"
                @click="main = mainUser._id"
            />
            <User :user="nowUser" text="Used" :clicked="false" :class="{ active: main === nowUser._id }"
                @click="main = nowUser._id"
            />

            <Button style="margin: 12px 0 0 0;" :disabled="!main"
                @click="section++"
            >
                <span>Continue</span>
            </Button>
        </section>
        
        <section v-if="section === 1">
            <Text class="text" text="What data should I merge?"/>

            <div class="checkboxs">
                <Checkbox :value="true">Economy and level</Checkbox>
                <Checkbox :value="true">Statistics</Checkbox>
                <Checkbox :value="true">Friends</Checkbox>
            </div>

            <Textbox label="Password" style="margin: 12px 0 0 0;"
                @input="password = ($event.target as any)?.value"
            />

            <Button style="margin: 12px 0 0 0;" :disabled="!main"
                @click="merge"
            >
                <span>Merge</span>
            </Button>
        </section>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import User from '~/components/models/user/Card.vue';

import type { IUser, TMergeScopes } from '~/types/api/user';

export type IMergeData = {
    main: string;
    now: string;
    save(): void;
}

const { $api } = useNuxtApp();

const
    user = useUserStore(),
    notifications = useNotificationsStore(),
    windows = useWindowsStore();

const props = defineProps({
    windowId: { type: Number },
    data: { type: Object as PropType<IMergeData> }
});

const
    section = ref<number>(0),
    main = ref<string>(''),
    mainUser = ref<IUser>({} as IUser),
    nowUser = ref<IUser>({} as IUser),
    password = ref<string>('');

const scopes: Array<TMergeScopes> = [];


async function loadUser(userId: string, name: 'mainUser' | 'nowUser') {
    if (!userId) return;

    const [_user, status] = await $api.users.get(userId);

    if (status !== 200) return notifications.push({
        icon: 'users',
        title: `Error load user (${status || 501})`,
        message: (_user as any)?.message || 'Server error'
    });

    if (name === 'mainUser') mainUser.value = _user;
    else nowUser.value = _user;
}

async function merge() {
    if (!main.value) return;

    const [result, status] = await $api.users.merge({
        old: mainUser.value?._id,
        now: nowUser.value?._id,
        select: main.value,
        password: password.value,
        scopes
    });

    if (status !== 200) return notifications.push({
        icon: 'users',
        title: `Error merge (${status || 501})`,
        message: result?.message || 'Server error'
    });

    if (props.data?.save) props.data?.save();

    windows.close(props.windowId!);
}


onMounted(() => {
    loadUser(props.data?.main!, 'mainUser');
    loadUser(props.data?.now!, 'nowUser');
});

</script>

<style lang="scss" scoped>

.block.merge {
    max-width: 376px;

    .title {
        margin: 0 0 12px 0;
        font-size: 18px;
    }

    .text {
        margin: 0 0 12px 0;
        color: var(--text-secondary);
    }

    .user {
        margin: 12px 0 0 0;

        &.active {
            border-color: var(--main-color);
        }
    }

    .checkboxs {
        .ui-checkbox {
            margin: 0 0 8px 0;
        
            &:last-child {
                margin: 0;
            }
        }
    }
}

</style>