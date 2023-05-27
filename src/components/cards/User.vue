<template>
    <div :class="['user', { hover: hovered }]"
        @click="clicked ? $windows.create({ component: 'User', data: user?._id }) : null"
    >
        <div class="avatar" :style="{ '--avatar': `url('${user?.avatar || getAvatar({ nameId: user?._id })}')` }"></div>
        <div style="max-width: 100%; width: 100%;">
            <div class="username">{{ user?.nickname || user?.username || user?._id }}</div>
            <Text class="text" :text="text" v-show="text"/>
        </div>
    </div>
</template>

<script setup lang="ts">

import { getAvatar } from '../../libs/utils';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { IUser } from '../../libs/api/routes/users';

export default defineComponent({
    name: 'CardUser',
    computed: {},
    props: {
        user: {
            type: Object as PropType<IUser>
        },
        text: {
            type: String
        },
        clicked: {
            type: Boolean,
            default: true
        },
        hovered: {
            type: Boolean,
            default: true
        }
    },
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

.user {
    display: flex;
    padding: 8px;
    width: 100%;
    border: 1px solid var(--T);
    border-radius: 5px;
    align-items: center;
    box-sizing: border-box;
    transition: .2s;
    overflow: hidden;

    &.hover:hover {
        cursor: pointer;
        border-color: var(--background-secondary);
    }

    .avatar {
        margin: 0 8px 0 0;
        min-width: 32px;
        height: 32px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        background-image: var(--avatar);
        background-color: var(--background-secondary);
    
        & + div {
            .username {
                max-width: calc(100% - 40px);
            }
        }
    }

    .username {
        max-width: calc(100% - 32px);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .text {
        max-width: calc(100% - 32px);
        color: var(--text-secondary);
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
}

</style>