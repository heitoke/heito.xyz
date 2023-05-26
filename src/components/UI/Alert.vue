<template>
    <div :class="['ui-alert', type, { hover }]">
        <slot v-if="isSlot"/>
        <div v-else>So far there is nothing here o_O</div>
    </div>
</template>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

export default defineComponent({
    name: 'UIAlert',
    computed: {
        isSlot() {
            try {
                return (this.$slots as any)?.default();
            } catch (err) {
                return false;
            }
        }
    },
    props: {
        hover: {
            type: Boolean,
            default: false
        },
        type: {
            type: String as PropType<'default' | 'mini'>,
            default: () => 'default'
        }
    },
    data: () => ({}),
    watch: {},
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

.ui-alert {
    padding: 48px;
    color: var(--text-secondary);
    text-align: center;
    border-radius: 15px;
    border: 5px dashed var(--text-primary);
    background-color: var(--main-color-alt);
    transition: .2s;
    user-select: none;

    &.default {
        div {
            font-size: 20px;
            text-transform: uppercase;
        }
    }

    &.mini {
        padding: 12px 24px;
        border-radius: 7px;
        border-width: 2px;
    }

    &.hover {
        opacity: .5;

        &:hover {
            opacity: 1;
        }
    }
}

</style>