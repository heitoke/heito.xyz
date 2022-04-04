<template>
    <label>
        <input type="file" name="file" class="field-file" @input="$emit('onEvent', $event.target)" required>
    </label>
</template>

<script>

export default {
    name: 'FieldFile',
    components: {},
    computed: {},
    props: {},
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>

.field-file[type="file"] {
    margin: 0 0 12px 0;
    padding: 24px 48px;
    width: 100%;
    color: var(--color-3);
    border-radius: 5px;
    border: 5px solid var(--dimming);
    box-sizing: border-box;
    transition: .2s;
    z-index: -1;
    
    &:valid {
        color: var(--color);
        border: 5px dashed var(--main-color);
    }
}

</style>