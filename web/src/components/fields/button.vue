<template>
    <div :class="`field-button ${color}`">{{ text }}</div>
</template>

<script>

export default {
    name: 'FieldButton',
    components: {},
    computed: {},
    props: {
        text: { type: String, default: '' },
        color: { type: String, default: 'purple' }
    },
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>

// .field-button {
//     cursor: pointer;
//     padding: 10px 14px;
//     color: var(--color-2);
//     text-align: center;
//     border-radius: 5px;
//     background: var(--dimming);
//     transition: .2s;
//     user-select: none;

//     &:hover { color: var(--color); }
// }

.field-button {
    cursor: pointer;
    padding: 8px 14px;
    text-align: center;
    border-radius: 5px;
    border: 3px solid var(--T);
    background: var(--dimming);
    transition: .2s;
    user-select: none;

    &:hover {
        color: #000 !important;
        border-color: var(--bg);

        &.orange {
            box-shadow: 0 0 0px 5px var(--C6-alt);
            background: var(--C6) !important;
        }

        &.red {
            color: #fff !important;
            box-shadow: 0 0 0px 5px var(--C5-alt);
            background: var(--C5) !important;
            
            &.dark {
                box-shadow: 0 0 0px 5px var(--C4-alt);
                background: var(--C4 !important);
            }
        }

        &.yellow {
            box-shadow: 0 0 0px 5px var(--C3-alt);
            background: var(--C3) !important;
        }

        &.green {
            box-shadow: 0 0 0px 5px var(--C2-alt);
            background: var(--C2) !important;
        }

        &.blue {
            color: #fff !important;
            box-shadow: 0 0 0px 5px var(--C7-alt);
            background: var(--C7) !important;
        }

        &.purple {
            box-shadow: 0 0 0px 5px var(--C1-alt);
            background: var(--C1) !important;
        }
    }

    &:active {
        transform: scale(.9);
    }
}

</style>