<template>
    <AnimationHeight :showed="edit">
        <div class="buttons" :style="`border-color: ${color};`">
            <Button v-for="btn of buttons" :key="btn.label"
                :color="btn?.color"
                @click="btn?.click ? btn?.click() : null"
            >{{ btn?.label }}</Button>
        </div>
    </AnimationHeight>
</template>

<script lang="ts" setup>

import AnimationHeight from '../../../components/animations/Height.vue';

</script>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { mapActions } from 'vuex';

interface IButton {
    label: string;
    color: string;
    click(): void;
}

export default defineComponent({
    name: 'BlogContent',
    computed: {},
    props: {
        buttons: {
            type: Object as PropType<Array<IButton>>
        },
        color: {
            type: String,
            default: 'var(--main-color-alt)'
        },
        edit: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({}),
    methods: {
        ...mapActions(['setToolpic'])
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

.buttons {
    display: flex;
    margin: 12px 0 0 0;
    padding: 12px 0;
    border-top: 3px dashed var(--background-secondary);

    .ui-button {
        margin: 0 12px 0 0;
        width: max-content;

        &:last-child {
            margin: 0;
        }
    }
}

</style>