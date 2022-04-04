<template>
    <div class="settings-add-link">
        <div class="title">{{ data.title }}</div>
        <Text text="Label" :value="data?.label" @onEvent="label = $event"/>
        <br>
        <Text text="Icon" :value="data?.icon" @onEvent="icon = $event" style="margin: 12px 0;"/>
        <br>
        <Text text="URL" :value="data?.url" @onEvent="url = $event"/>
        <Button :text="data?.button || 'Add'" style="margin: 12px 0 0 0;" @click="data.save({ label, icon, url })"/>
    </div>
</template>

<script>

export default {
    name: 'SettingsAddLinkMenu',
    components: {},
    computed: {},
    props: {
        data: { type: Object }
    },
    data() {
        return {
            label: '',
            icon: '',
            url: ''
        }
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>

.block.settings-add-link {
    padding: 12px;
    min-width: 215px;
    border-radius: 5px;
    background: var(--bg);
}

</style>