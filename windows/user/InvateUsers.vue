<template>
    <div class="invate-users" ref="root">
        <Select :sort="false" label="UserId, username, nickname or email" :readonly="false"
            :menu="getSearchUsers"
            @input="searchUsers(($event.target as any)?.value)"
            @select="addMember($event.value)"
        />

        <ScrollBar max-height="256px" v-if="list?.length > 0" style="margin: 12px 0 0 0;">
            <User v-for="({user, permission}, idx) of list" :key="idx"
                :user="user" :text="permission"
                @contextmenu="open(idx)"
            />
        </ScrollBar>

        <Button style="margin: 12px 0 0 0;"
            @click="list.length > 0 && data?.save ? data?.save(list.map(x => ({ id: x.user._id, permission: x.permission }) as IMember)) : null"
        >Invate</Button>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import ScrollBar from '~/components/content/ScrollBar.vue';

import User from '~/components/cards/User.vue';

import type { IUser } from '~/types/api/user';
import { EProjectPermission } from '~/types/api/project';

interface IMember {
    id: string;
    permission: EProjectPermission;
}

const { $api } = useNuxtApp();

const
    windows = useWindowsStore(),
    contextMenu = useContextMenusStore();

const root = ref<HTMLElement | null>(null);

const props = defineProps({
    windowId: { type: Number },
    data: { type: Object as PropType<{ save(members: Array<IMember>): void }> }
});

const
    text = ref<string>(''),
    users = ref<Array<IUser>>([]),
    list = ref<Array<{ user: IUser, permission: EProjectPermission }>>([]);

let timer: NodeJS.Timeout;


const getSearchUsers = computed(() => {
    return users.value.map(u => ({
        label: u?.nickname || u?.username || u?._id,
        value: u._id,
        img: u?.avatar || getAvatar({ nameId: u?._id })
    }));
});


function searchUsers(text: string) {
    clearTimeout(timer);

    timer = setTimeout(async () => {
        const [result, status] = await $api.users.list({ text });

        if (status !== 200) return;

        users.value = result.results;
    }, 500);
}

function addMember(userId: string) {
    if (list.value.findIndex(u => u.user._id === userId) > -1) return;

    const user = users.value.find(u => u._id === userId);

    if (!user) return;
    
    list.value = [...list.value || [], {
        user,
        permission: EProjectPermission.Member
    }];
}

function open(idx: number) {
    const { user, permission } = list.value[idx];

    const changePermission = () => {
        const { windowId } = windows.create({
            component: 'Message',
            data: {
                title: 'Change member permission',
                icon: 'clubs',
                components: [
                    {
                        name: 'per',
                        component: 'Select',
                        props: {
                            label: 'Permission',
                            menu: Object.keys(EProjectPermission).map(x => ({
                                label: x,
                                value: EProjectPermission[x as keyof typeof EProjectPermission]
                            })),
                            value: permission
                        },
                        events: {
                            select: (e: any) => {
                                list.value[idx].permission = e.value;
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        label: 'Change',
                        click: () => {
                            windows.close(windowId);
                        }
                    }
                ]
            }
        });
    }

    contextMenu.create({
        name: `invate:users:user:${user._id}`,
        position: ['fixed-target', 'center', 'bottom'],
        event: root.value?.querySelector(`ul .user:nth-child(${idx + 1})`)!,
        buttons: [
            {
                label: 'Change permission',
                icon: 'clubs',
                click: changePermission
            },
            {
                label: 'Remove',
                icon: 'close',
                click: () => {
                    list.value = list.value.filter((_, i) => i !== idx);
                }
            }
        ]
    });
}

</script>

<style lang="scss" scoped>

.block.invate-users {
    min-width: 256px;
}

</style>