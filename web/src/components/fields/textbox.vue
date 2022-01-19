<template>
    <div class="textbox">
        <input type="text" v-model="textValue" required>
        <div :style="{ 'background': color || null }">{{ text }}</div>
    </div>
</template>

<script>

export default {
    name: 'FieldButton',
    props: {
        text: String,
        value: String || Number,
        color: String
    },
    components: {},
    computed: {},
    data() {
        return {
            textValue: null
        }
    },
    methods: {},
    mounted() {
        this.textValue = this.value;
    }
}
</script>

<style lang="scss" scoped>

.textbox {
    
}

</style>