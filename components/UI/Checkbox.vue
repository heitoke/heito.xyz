<template>
    <label class="ui-checkbox">
        <input type="checkbox" :checked="modelValue" @change="$emit('onEvent', modelValue = !modelValue)">
        <div :style="{ margin: isSlot ? '0 12px 0 0' : '' }"></div>
        <slot/>
    </label>
</template>

<script lang="ts" setup>

const slots = defineSlots();

const isSlot = computed(() => {
    try {
        return (slots as any)?.default();
    } catch (err) {
        return false;
    }
});

const props = defineProps({
    value: { type: Boolean }
});

const modelValue = ref<boolean>(false);

watch(() => props.value, (newValue: boolean) => {
    modelValue.value = newValue;
});

onMounted(() => {
    modelValue.value = props.value;
});

</script>

<style lang="scss" scoped>

.ui-checkbox {
    cursor: pointer;
    display: flex;
    align-items: center;

    div {
        width: 32px;
        height: 16px;
        position: relative;
        border-radius: 25px;
        background: var(--background-secondary);
        transition: .2s;

        &:active::after {
            width: 16px;
            border-radius: 15px;
        }

        &::after {
            content: " ";
            width: 12px;
            height: 12px;
            position: absolute;
            top: 2px;
            left: 4px;
            border-radius: 50%;
            background: var(--text-secondary);
            transition: .2s;
        }
    }

    input {
        display: none;

        &:checked + div {
            background: var(--main-color-alt);

            &::after {
                left: calc(100% - 16px);
                background: var(--main-color);
            }
        }

        &:checked + div:active::after {
            width: 16px;
            left: calc(100% - 20px);
            border-radius: 15px;
        }
    }
}

</style>