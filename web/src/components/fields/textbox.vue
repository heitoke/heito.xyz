<template>
    <input class="field-text" :type="type" :value="value" :placeholder="text" :p="p" @input="this.$emit('onEvent', $event.target.value)" required>
</template>

<script>

export default {
    name: 'FieldTextbox',
    components: {},
    computed: {},
    props: {
        value: { type: String, default: '' },
        text: { type: String, default: '' },
        p: { type: String, default: 'left' },
        type: { type: String, default: 'text' }
    },
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>

input {
    padding: 10px 16px;
    width: calc(100% - 32px);
    color: var(--color);
    border-radius: 5px;
    border: 1px solid var(--T);
    background: var(--dimming);
    transition: .2s;

    &[p="center"] {
        text-align: center;
    }
    &[p="right"] {
        text-align: right;
    }

    &:focus, &:valid {
        border: 1px solid var(--C1-alt);
    }
}

</style>