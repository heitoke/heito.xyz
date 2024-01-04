<template>
    <div class="message">
        <div class="header" v-if="data?.icon || data?.title">
            <Icon :name="data.icon" v-if="Boolean(data?.icon)"/>

            <span>{{ data.title }}</span>
        </div>

        <div class="text" v-if="Boolean(data?.text)">{{ data?.text }}</div>

        <component v-for="component of data?.components" :key="component.name"
            :is="component.component"
            :style="component?.style || ''"
            
            v-bind="component.props"
            v-on="Object.keys(component?.events || {}).length > 0 ? component?.events : {}"
        ></component>
    </div>
</template>

<script lang="ts" setup>

import type { ItemComponent } from '~/types/stores/contextMenu';

export interface Message {
    title?: string;
    text?: string;
    icon?: string;
    components: Array<Omit<ItemComponent, 'type' | 'label'>>;
}


const props = defineProps<{
    windowId: number;
    data: Message;
    close(): void;
}>();

</script>

<style lang="scss" scoped>

.block.message {}

</style>