<template>
    <div class="message">
        123
    </div>
</template>

<script lang="ts" setup>

export interface Message {
    title: string;
}


const props = defineProps<{
    windowId: number;
    data: Message;
    close(): void;
}>();

</script>

<style lang="scss" scoped>

.block.message {
    height: 10000px;
}

</style>