<template>
    <div class="invate-users">
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

import ScrollBar from '../../components/content/ScrollBar.vue';

import User from '../../components/cards/User.vue';

</script>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import Users, { IUser } from '../../libs/api/routes/users';
import { EProjectPermission } from '../../libs/api/routes/projects';

import { getAvatar } from '../../libs/utils';
import { mapActions } from 'vuex';

interface IMember {
    id: string;
    permission: EProjectPermission;
}

export default defineComponent({
    name: 'WindowInvateUsers',
    components: {},
    computed: {
        getSearchUsers() {
            return this.users.map(u => ({
                label: u?.nickname || u?.username || u?._id,
                value: u._id,
                img: u?.avatar || getAvatar({ nameId: u?._id })
            }));
        }
    },
    props: {
        windowId: { type: Number },
        data: { type: Object as PropType<{ save(members: Array<IMember>): void }> }
    },
    data: () => ({
        text: '',
        users: [] as Array<IUser>,
        list: [] as Array<{ user: IUser, permission: EProjectPermission }>,
        timer: {} as NodeJS.Timeout,
    }),
    watch: {},
    methods: {
        ...mapActions(['setContextMenu']),
        searchUsers(text: string) {
            clearTimeout(this.timer);

            this.timer = setTimeout(async () => {
                const [result, status] = await Users.list({ text });

                if (status !== 200) return;

                this.users = result.results;
            }, 500);
        },
        addMember(userId: string) {
            if (this.list.findIndex(u => u.user._id === userId) > -1) return;

            const user = this.users.find(u => u._id === userId);

            if (!user) return;
            
            this.list = [...this.list || [], {
                user,
                permission: EProjectPermission.Member
            }];
        },
        open(idx: number) {
            const { user, permission } = this.list[idx];

            this.setContextMenu({
                name: `invate:users:user:${user._id}`,
                position: ['fixed-target', 'center', 'bottom'],
                event: (this.$el as Element)?.querySelector(`ul .user:nth-child(${idx + 1})`),
                buttons: [
                    {
                        label: 'Change permission',
                        icon: 'clubs',
                        click: () => {
                            const { windowId } = this.$windows.create({
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
                                                    this.list[idx].permission = e.value;
                                                }
                                            }
                                        }
                                    ],
                                    buttons: [
                                        {
                                            label: 'Change',
                                            click: () => {
                                                this.$windows.close(windowId);
                                            }
                                        }
                                    ]
                                }
                            })
                        }
                    },
                    {
                        label: 'Remove',
                        icon: 'close',
                        click: () => {
                            this.list = this.list.filter((_, i) => i !== idx);
                        }
                    }
                ]
            });
        }
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.block.invate-users {
    min-width: 256px;
}

</style>