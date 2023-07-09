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

        <Select :menu="listPermissions" label="Select permission"
            @select="permissions.find(per => $event.value === per) ? null : permissions = [...permissions, $event.value]"
        />

        <Button style="margin: 12px 0 0 0;"
            @click="data?.save(permissions, windowId as number)"
        >Continue</Button>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import { EPermissions, listPermissions, IButtonPermission } from '~/types/api/user';

const props = defineProps({
    windowId: { type: Number },
    data: {
        type: Object as PropType<{
            list: Array<EPermissions>,
            save(permissions: Array<EPermissions>, windowId: number): void;
        }>
    }
});

const permissions = ref<Array<EPermissions>>([]);


const getListSelectPermissions = computed(() => {
    return listPermissions.filter(per => permissions.value.find(p => p === per.value));
});


onMounted(() => {
    permissions.value = props.data?.list || [];
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