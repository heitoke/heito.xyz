<template>
    <Transition name="height"
        @enter="enter($event as HTMLElement)"
        @after-enter="after($event as HTMLElement)"
        @leave="leave($event as HTMLElement)"
        @after-leave="after($event as HTMLElement)"
    >
        <div class="height-content" v-if="show"
            :style="style"
        >
            <slot/>
        </div>
    </Transition>
</template>

<script lang="ts" setup>

const props = defineProps({
    show: { type: Boolean },
    opacity: { type: Boolean, default: false },
    duration: { type: Number, default: 0.3 }
});

const style = ref({
    '--opacity': props.opacity ? 0 : 1,
    '--duration': (props.duration || 0.3) + 's'
});

function enter(el: HTMLElement) {
    el.style.height = 'auto';

    const { height } = window.getComputedStyle(el);

    el.style.height = '0px';
    el.offsetHeight;

    el.style.height = height;
}

function after(el: HTMLElement) {
    el.style.removeProperty('height');
}

function leave(el: HTMLElement) {
    const { height } = window.getComputedStyle(el);

    el.style.height = height;

    el.offsetHeight;

    el.style.height = '0px';
}

</script>


<style lang="scss" scoped>

.height-enter-active,
.height-leave-active {
    transition: height var(--duration) ease-in-out;
    overflow: hidden;
    opacity: var(--opacity);
}

.height-enter,
.height-leave-to {
    height: 0;
}

.height-content {
    transition: all var(--duration) ease-in-out;
}

</style>