<template>
    <div class="ui-radio">
        <input type="radio" :name="name" :id="`${id}`" :checked="value">

        <label :for="`${id}`">
            <slot/>
        </label>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps({
    value: { type: Boolean, default: false },
    name: { type: String }
});

const
    id = ref<number>(0),
    modelValue = ref<boolean>(false);

watch(() => props.value, (newValue: boolean) => {
    modelValue.value = newValue;
});

onMounted(() => {
    id.value = Date.now() + Math.random();

    modelValue.value = props.value;
});

</script>

<style lang="scss" scoped>

.ui-radio {
    cursor: pointer;
    display: flex;
    position: relative;
    align-items: center;

    input[type='radio'] {
        position: absolute;
        opacity: 0;
    }

    input, label {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }

    label {
        display: flex;
        position: relative;
        align-items: center;
    }

    input + label:before {
        content: '';
        margin: 0 10px 0 0;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: var(--background-secondary);
        transition: .2s;
        outline: 3px solid var(--T);
        outline-offset: 5px;
    }

    // input + label:before {
    // }

    input:checked + :before {
        background-color: var(--main-color);
        transform: scale(.65);
        outline-color: var(--main-color);
    }

    // input:focus + label:before {
    //     border: 2px solid #FF9800;
    // }
}

</style>