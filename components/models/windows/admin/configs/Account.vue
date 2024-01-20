<template>
    <div class="account">
        <Icon :name="icon || account.type"/>

        <div>
            <div>{{ label || account.type }}</div>

            <div
                @click="isOpen = !isOpen"
            >{{ isOpen ? account.key : '**********' }}</div>
        </div>

        <div style="margin-left: auto;"></div>
    
        <Checkbox :value="account.enabled"
            @update="$emit('enable', $event)"
        />
    </div>
</template>

<script lang="ts" setup>

import type { Account } from '~/types/api/config';


const $emit = defineEmits({
    enable(value: boolean) {
        return value;
    }
});

const props = defineProps<{
    icon?: string;
    label?: string;
    account: Account;
}>();


const isOpen = ref(false);

</script>

<style lang="scss" scoped>

.account {
    display: flex;
    padding: 8px 12px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    align-items: center;
    box-sizing: border-box;
    transition: .2s;

    .ui-icon {
        margin-right: 12px;
    }

    .ui-icon + div {
        div:nth-child(1) {
            max-width: 196px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        div:nth-child(2) {
            cursor: pointer;
            padding: 2px 8px;
            color: var(--text-secondary);
            font-size: 12px;
            border-radius: 5px;
            background-color: var(--background-secondary);
            transition: .2s;
            user-select: none;
        }
    }
}

</style>