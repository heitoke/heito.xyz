<template>
    <div class="header-users-online">
        <Loading v-if="loading"/>

        <User v-for="user of users" :key="user._id"
            :user="user"
        />
    </div>
</template>

<script lang="ts" setup>

import User from '~/components/models/user/Card.vue';

import { type IUser } from '~/types/api/user';


const { $api, $socket } = useNuxtApp();

const emit = defineEmits(['update']);

const contextMenu = useContextMenuStore();

const
    loading = ref<boolean>(false),
    users = ref<Array<IUser>>([]);


$socket.on('users:online', data => {
    if (data?.list?.length! > 0) {
        users.value = data?.list || [];
    }

    emit('update', { count: users.value.length, list: users.value });
});

onMounted(() => {
    $socket.emit('users:online', 'list');
});

</script>

<style lang="scss" scoped>

.header-users-online {
    min-width: 215px;
}

</style>