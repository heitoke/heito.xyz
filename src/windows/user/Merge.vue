<template>
    <div class="merge">
        <section v-if="section === 0">
            <Text class="title" text="Two accounts found"/>

            <Text class="text" text="Since you have already logged in to our site and your IP has changed, we think it would be nice to combine these two accounts into one. Please choose which account will be the main one."/>
            
            <User :user="mainUser" :clicked="false"  :class="{ active: main === mainUser._id }"
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

import User from '../../components/cards/User.vue';

</script>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import Users, { type IUser, type TMargeScopes } from '../../libs/api/routes/users';

export type IMergeData = {
    main: string;
    now: string;
    save(): void;
}

export default defineComponent({
    name: 'WindowMergeAccounts',
    components: {},
    computed: {
        ...mapGetters([])
    },
    props: {
        windowId: { type: Number },
        closeWindow: {
            type: Function,
            default: () => 1
        },
        data: {
            type: Object as PropType<IMergeData>
        }
    },
    data: () => ({
        section: 0,
        main: '',
        mainUser: {} as IUser,
        nowUser: {} as IUser,
        password: '',
        scopes: [] as Array<TMargeScopes>
    }),
    watch: {},
    methods: {
        ...mapActions([]),
        async loadUser(userId: string, name: 'mainUser' | 'nowUser') {
            if (!userId) return;

            let [user, status] = await Users.get(userId);

            if (status !== 200) return;

            this[name] = user;
        },
        async merge() {
            if (!this.main) return;

            let [result, status] = await Users.merge({ old: this.mainUser?._id, now: this.nowUser?._id, select: this.main, password: this.password, scopes: this.scopes });

            if (status !== 200) return;

            if (this.data?.save) this.data?.save();

            this.closeWindow();
        }
    },
    mounted() {
        console.log(this.data);
        
        this.loadUser(this.data?.main!, 'mainUser');
        this.loadUser(this.data?.now!, 'nowUser');
    }
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