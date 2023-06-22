<template>
    <Transition name="height"
        @enter="enter($event as HTMLElement)"
        @after-enter="after($event as HTMLElement)"
        @leave="leave($event as HTMLElement)"
        @after-leave="after($event as HTMLElement)"
    >
        <div class="height-content" v-if="showed">
            <slot/>
        </div>
    </Transition>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AnimationHeight',
    components: {},
    computed: {},
    props: {
        showed: { type: Boolean }
    },
    data: () => ({}),
    watch: {},
    methods: {
        enter(el: HTMLElement) {
            el.style.height = 'auto';

            const { height } = window.getComputedStyle(el);

            el.style.height = '0px';
            el.offsetHeight;

            el.style.height = height;
        },
        after(el: HTMLElement) {
            el.style.removeProperty('height');
        },
        leave(el: HTMLElement) {
            const { height } = window.getComputedStyle(el);

            el.style.height = height;

            el.offsetHeight;

            el.style.height = '0px';
        }
    },
    mounted() {}
});

</script>


<style lang="scss" scoped>

.height-enter-active,
.height-leave-active {
    transition: height .3s ease-in-out;
    overflow: hidden;
}

.height-enter,
.height-leave-to {
    height: 0;
}

.height-content {
    transition: all .3s ease-in-out;
}

</style>