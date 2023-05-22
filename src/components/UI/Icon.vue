<template>
    <i :class="`hx-icon i-${name}`"></i>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UIIcon',
    computed: {},
    props: {
        name: {
            type: String
        }
    },
    data: () => ({}),
    watch: {},
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

i.hx-icon {
    color: var(--text-primary);
    font-size: 16px;
    transition: .2s;
}

</style>