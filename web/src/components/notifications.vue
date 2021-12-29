<template>
    <div class="main-notifications">
        <ul class="list">
            <li v-for="notif of getNotifications.slice(0, 5)" :key="notif">
                <div class="text">{{ notif.text }}</div>
            </li>
        </ul>
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'MainHeader',
    computed: mapGetters(['getNotifications']),
    data() {
        return {}
    },
    methods: {
        ...mapActions(['addNotification'])
    },
    mounted() {}
}

</script>

<style lang="scss">

.main-notifications {
    position: fixed;
    top: 64px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 103;

    .list {
        li {
            margin: 0 0 4px 0;
            padding: 12px;
            max-width: 256px;
            border-radius: 5px;
            animation: ShowNotification 1s ease-in-out;
            background: var(--bg-2);

            .text {
                font-size: 13px;
                word-break: break-all;
            }
        }
    }
}

@keyframes ShowNotification {
    from {
        transform: translateY(-32px);
    }
}

</style>
