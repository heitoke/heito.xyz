<template>
    <div class="super">
        <ScrollBar v-slot="scrollProps">
            <Transition name="page">
                <component :is="component" :class="['page', { 'to-left': getActiveNotifications }]"
                    :scrollProps="scrollProps"
                ></component>
            </Transition>
            <Footer v-if="!($route.meta?.hide as any)?.includes('footer')"/>
        </ScrollBar>
    </div>
</template>

<script lang="ts" setup>

import Footer from '../Footer.vue';
import ScrollBar from '../content/ScrollBar.vue';

</script>

<script lang="ts">

import { type Component, PropType, defineComponent } from 'vue';

import { mapGetters, mapActions } from 'vuex';

export default defineComponent({
    name: 'HorizontalSuperMode',
    computed: {
        ...mapGetters(['getActiveNotifications'])
    },
    props: {
        component: {
            type: Object as PropType<Component>,
            required: true
        }
    },
    mounted() {}
});

</script>

<style lang="scss" scoped></style>