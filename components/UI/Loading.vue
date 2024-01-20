<template>
    <div class="ui-loading">
        <Skeleton/>

        <CircleSpinner size="20px"/>

        <div class="label">{{ label }}{{ labelAfter }}</div>
    </div>
</template>

<script lang="ts" setup>

import CircleSpinner from '../models/other/CircleSpinner.vue';


const props = withDefaults(defineProps<{
    label?: string;
    anim?: boolean;
}>(), {
    label: 'Loading',
    anim: true
});


const labelAfter = ref('');


function changeDefaultLabel() {
    setTimeout(() => {
        const after = labelAfter.value;
        
        labelAfter.value = after.includes('...') ? '' : after + '.';

        changeDefaultLabel();
    }, 500);
}


onMounted(() => {
    if (props?.anim) changeDefaultLabel();
});

</script>

<style lang="scss" scoped>

.ui-loading {
    display: flex;
    padding: 12px;
    position: relative;
    align-items: center;
    overflow: hidden;

    .ui-skeleton {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid var(--main-color);
        box-sizing: border-box;
    }

    .label {
        margin-left: 12px;
        color: var(--text-secondary);
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
    }
}

</style>