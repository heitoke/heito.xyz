<template>
    <div class="error">
        <h1>{{ error?.statusCode }}</h1>

        <div :class="['content', 'code-' + error?.statusCode]">
            <div v-html="error?.message"></div>
        </div>

        <Button style="width: max-content;"
            @click="$router.push('/')"
        >
            <span>Go home</span>
        </Button>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

interface TypeError {
    url: string;
    statusCode: 404;
    statusMessage: string;
    message: string;
    stack: string;
}

const props = defineProps({
    error: {
        type: Object as PropType<TypeError>
    }
});


useSeoMeta({
    title: `Error page (${props.error?.statusCode}) | heito.xyz`
});


onMounted(() => {
    document.querySelector('html')?.setAttribute('theme', 'dark');
});

</script>


<style lang="scss" scoped>

.error {
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: var(--background-primary);

    h1 {
        margin: 0;
        font-size: var(--font);
    }

    .content {
        margin: 12px 0 24px 0;
        max-width: 90vw;
        max-height: 70vh;
        padding: 12px;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        transition: .2s;

        &:hover {
            box-shadow: 0 0 0 3px var(--main-color-alt);
        }
    }
}

</style>