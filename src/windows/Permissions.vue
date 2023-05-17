<template>
    <div class="permissions">
        <div class="title">Change permissions</div>

        <ul v-show="permissions?.length > 0">
            <li v-for="per of getListSelectPermissions" :key="per.value"
                @click="permissions = permissions.filter(p => p !== per.value)"
            >
                <Icon :name="per?.icon"/>
                <span>{{ per.label }}</span>
            </li>
        </ul>

        <Select :menu="menu"
            @select="permissions.find(per => $event.value === per) ? null : permissions = [...permissions, $event.value]"
        />

        <Button style="margin: 12px 0 0 0;"
            @click="data?.save(permissions, windowId as number)"
        >Continue</Button>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { EPermissions } from '../libs/api/routes/users';

export interface IPer {
    label: string;
    text: string;
    value: EPermissions;
    icon: string;
}

export const menu = [
    {
        label: 'Self',
        text: 'Manage yourself',
        value: EPermissions.Self,
        icon: 'heart'
    },
    {
        label: 'Users',
        text: 'Allows you to manage users',
        value: EPermissions.Users,
        icon: 'user-circle'
    },
    {
        label: 'Projects',
        text: 'Allows you to manage projects',
        value: EPermissions.Projects,
        icon: 'lab'
    },
    {
        label: 'Blogs',
        text: 'Allows you to manage blogs',
        value: EPermissions.Blogs,
        icon: 'quill'
    },
    {
        label: 'Site',
        text: 'Allows you to manage the site',
        value: EPermissions.Site,
        icon: 'damage-void'
    }
] as Array<IPer>

export default defineComponent({
    name: 'WindowPermissons',
    components: {},
    computed: {
        getListSelectPermissions(): Array<IPer> {
            return this.menu.filter(per => this.permissions.find(p => p === per.value));
        }
    },
    props: {
        windowId: { type: Number },
        data: {
            type: Object as PropType<{ list: Array<EPermissions>, save(permissions: Array<EPermissions>, windowId: number): void; }>
        }
    },
    data: () => ({
        permissions: [] as Array<EPermissions>,
        menu
    }),
    watch: {},
    methods: {},
    mounted() {
        this.permissions = this.data?.list || [];
    }
});

</script>

<style lang="scss" scoped>

.block.permissions {
    max-width: 256px;
    position: relative;

    .title {
        font-size: 20px;
    }

    ul {
        display: flex;
        margin: 12px 0;
        flex-wrap: wrap;

        li {
            cursor: pointer;
            display: flex;
            margin: 0 8px 4px 0;
            padding: 4px 8px;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            align-items: center;

            i {
                margin: 0 4px 0 0;
            }
        }
    }
}

</style>