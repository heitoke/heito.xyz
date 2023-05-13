<template>
    <div class="ref">
        <main>
            <!-- <div class="user">
                <div class="avatar" :style="{ 'background-color': `url('${getAvatar({ nameId: getUser?._id })}')` }"></div>
                <div>
                    <div class="ref-owner">The owner of the referral link</div>
                    <div class="username">{{ getUser?.nickname || getUser?.username || getUser?._id }}</div>
                </div>
            </div> -->
            <User :user="getUser" text="The owner of the referral link" :hovered="false"
                style="width: 100%; margin: 0 0 12px 0;"
            />

            <Text class="text" text="You have followed the referral link, do you want to register using it? You can also refuse in this case you will not lose anything, maybe only that the user who owns this referral link will be sad, so do you want to please him or not? :D"/>
            
            <ul class="buttons">
                <Button color="var(--green)" @click="createWindow({ component: 'Auth', data: 'register', props: { refCode: $route.params?.refId } })">
                    <span>To agree</span>
                </Button>
                <Button color="var(--red)"
                    @click="$router.push('/')"
                >
                    <span>Refuse</span>
                </Button>
            </ul>
        </main>
    </div>
</template>

<script lang="ts" setup>

import User from '../components/cards/User.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapGetters, mapActions } from 'vuex';

import { getAvatar } from '../libs/functions';

export default defineComponent({
    name: 'RefPage',
    components: {},
    computed: {
        ...mapGetters(['getUser'])
    },
    data: () => ({}),
    watch: {},
    methods: {
        ...mapActions(['createWindow']),
        getAvatar
    },
    mounted() {
        console.log(this.$route.params?.refId);
        
    }
})

</script>


<style lang="scss" scoped>

.page.ref {
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    main {
        max-width: 376px;
    }

    .text {
        color: var(--text-secondary);
    }

    ul.buttons {
        display: flex;
        margin: 12px 0 0 0;
        align-items: center;

        .ui-button {
            margin: 0 12px 0 0;

            &:last-child {
                margin: 0;
            }
        }
    }
}

</style>