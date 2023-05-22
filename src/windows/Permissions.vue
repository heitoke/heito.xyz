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

        <Select :menu="listPermissions"
            @select="permissions.find(per => $event.value === per) ? null : permissions = [...permissions, $event.value]"
        />

        <Button style="margin: 12px 0 0 0;"
            @click="data?.save(permissions, windowId as number)"
        >Continue</Button>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { EPermissions, listPermissions, IButtonPermission } from '../libs/api/routes/users';

export default defineComponent({
    name: 'WindowPermissons',
    components: {},
    computed: {
        getListSelectPermissions(): Array<IButtonPermission> {
            return this.listPermissions.filter((per: IButtonPermission) => this.permissions.find(p => p === per.value));
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
        listPermissions
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