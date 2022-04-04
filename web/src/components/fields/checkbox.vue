<template>
    <label :class="`field-checkbox ${type}`">
        <input type="checkbox" v-model="mainValue">
        <div></div>
    </label>
</template>

<script>

export default {
    name: 'FieldCheck',
    components: {},
    computed: {},
    props: {
        value: { type: Boolean, default: false },
        type: { type: String, default: 'default' }
    },
    data() {
        return {
            mainValue: null
        }
    },
    updated() {
        this.$emit('onEvent', this.mainValue);
    },
    methods: {},
    mounted() {

        this.mainValue = this.value;

    }
}
</script>

<style lang="scss" scoped>

.field-checkbox {

    &.default {
        div {
            cursor: pointer;
            width: 32px;
            height: 16px;
            position: relative;
            border-radius: 25px;
            background: var(--dimming);
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
                background: var(--color-2);
                transition: .2s;
            }
        }

        input {
            display: none;

            &:checked + div::after {
                left: calc(100% - 16px);
                background: var(--C1);
            }

            &:checked + div:active::after {
                width: 16px;
                left: calc(100% - 20px);
                border-radius: 15px;
            }
        }
    }

    &.square {
        div {
            cursor: pointer;
            width: 13px;
            height: 13px;
            position: relative;
            border-radius: 5px;
            border: 3px solid var(--bg-2);
            background: var(--bg-2);
            transition: .2s;
        }

        input {
            display: none;

            &:checked + div {
                // box-shadow: 0 0 0px 5px var(--C1-alt);
                background: var(--C1);
            }
        }
    }

}

</style>