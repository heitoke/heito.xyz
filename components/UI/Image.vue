<template>
    <div :class="['ui-image', { error }]"
        :style="{ 'background-image': `url('${image}')` }"
    >
        <Transition name="load">
            <Skeleton v-if="!image && skeleton && !error"/>
        </Transition>

        <slot/>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps({
    src: { type: String, required: true },
    skeleton: { type: Boolean, default: true }
});

const
    image = ref<string>(''),
    error = ref<boolean>(false);


watch(() => props.src, () => {
    renderImage();
});



function renderImage() {
    error.value = false;

    const img = new Image();

    img.src = props.src;

    img.onload = () => {
        image.value = props.src;
    }

    img.onerror = () => {
        error.value = true;
    }
}

onMounted(() => {
    renderImage();
});

</script>

<style lang="scss" scoped>

.load-enter-active,
.load-leave-active {
    opacity: 0;
}

.ui-image {
    width: 24px;
    height: 24px;
    position: relative;
    background-size: cover;
    background-position: center;
    transition: .2s;
    -khtml-background-size: cover;
    -moz-background-size: cover;
    -ms-background-size: cover;
    -o-background-size: cover;
    -webkit-background-size: cover;
    overflow: hidden;

    &.error {
        background-color: var(--background-secondary);
    }

    .ui-skeleton {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 0px;
        transition: all .5s;
    }
}

</style>