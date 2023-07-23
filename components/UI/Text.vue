<template>
    <component :is="type">{{ value }}</component>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

const props = defineProps({
    text: { type: String },
    type: {
        type: String as PropType<'div' | 'span'>,
        default: 'div'
    }
});

const
    value = ref(''),
    n = ref(0);

let timer: NodeJS.Timer;

watch(() => props.text as any, () => {
    if (!props.text) return;

    n.value = 0;
    value.value = '';

    clearInterval(timer);

    timer = setInterval(async () => {
        if (!props.text) return clearInterval(timer);
        
        value.value += props.text[n.value++];
        if (n.value >= props.text.length) clearInterval(timer);
    }, Math.round(1000 / props.text?.length));
});

onMounted(() => {
    if (props.text) value.value = props.text || '';
});

</script>

<style lang="scss" scoped>

</style>