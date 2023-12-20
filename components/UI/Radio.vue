<template>
    <label :class="['ui-radio']">
        <input type="radio"
            :name="name"
            :value="value"
            :checked="checked"

            @change="onClick($event)"
        >
        
        <div></div>
    </label>
</template>

<script lang="ts" setup>

const $emit = defineEmits({
    update(value: boolean | string | number) {
        return value;
    }
});

const props = defineProps<{
    checked?: boolean;
    name?: string;
    value: boolean | string | number;
}>();


function onClick(event: Event) {
    $emit('update', props.value);
}

</script>

<style lang="scss" scoped>

.ui-radio {
    cursor: pointer;
    display: flex;
    align-items: center;

    div {
        display: flex;
        width: 16px;
        height: 16px;
        position: relative;
        border-radius: 25px;
        align-items: center;
        justify-content: center;
        background: var(--background-secondary);
        transition: .2s;

        &:active::after {
            transform: scale(.6);
        }

        &::after {
            content: "";
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--text-secondary);
            transition: .2s;
            transform: scale(.4);
        }
    }

    input {
        display: none;

        &:checked + div {
            background: var(--main-color-alt);
            box-shadow: 0 0 0 1px var(--main-color);

            &::after {
                background: var(--main-color);
                transform: scale(.7);
            }
        }
    }

    &:not(.only-click) input:disabled {
        & + div {
            opacity: .5;
        }
    }
}

</style>