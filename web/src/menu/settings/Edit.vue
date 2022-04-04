<template>
    <div class="settings-edit">
        <div class="title">{{ data.title }}</div>
        <Text :value="data.value" @onEvent="value = $event" @keydown.enter="data.save(value)"/>
        <Button text="Save" style="margin: 12px 0 0 0;" @click="data.save(value); closeMenu(id)"/>
    </div>
</template>

<script>

export default {
    name: 'SettingsEditMenu',
    components: {},
    computed: {},
    props: {
        data: { type: Object },
        id: { type: Number }
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>

.block.settings-edit {
    padding: 12px;
    min-width: 215px;
    border-radius: 5px;
    background: var(--bg);
}

</style>