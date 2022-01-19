<template>
    <div class="back font-5">{{ text }}</div>
</template>

<script>

export default {
    name: 'FieldButton',
    props: {
        text: String
    },
    components: {},
    computed: {},
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>
.back {
    cursor: pointer;
    margin: 8px 0 0 0;
    padding: 8px 16px;
    position: relative;
    transition: .3s;
    overflow: hidden;

    &::after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 100%;
        left: 0;
        background: var(--color);
        transform: scale(.7);
        transition: .2s;
        z-index: -1;
    }

    &:hover {
        color: var(--bg);
        text-decoration: underline;
        background: var(--color);

        &::after {
            top: 0;
            transform: scale(1);
        }
    }
}
</style>