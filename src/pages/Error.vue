<template>
    <div class="error">
        <div>404</div>
    </div>
</template>

<script lang="ts">

import { defineAsyncComponent } from 'vue';

import { mapGetters } from 'vuex';

export default {
    name: 'ErrorPage',
    components: {
        Text: defineAsyncComponent(() => import('../components/UI/Text.vue'))
    },
    computed: {
        ...mapGetters(['getLang'])
    },
    data: () => ({
        title: {
            en: 'Welcome my friend',
            ru: 'Добро пожаловать мой друг'
        },
        text: {
            en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex odio ad soluta obcaecati magnam sit eius dolor. Numquam dolore exercitationem maxime repellat molestias neque quos.',
            ru: 'Lore2m ipsum dolor sit amet, consectetur adipisicing elit. Ex odio ad soluta obcaecati magnam sit eius dolor. Numquam dolore exercitationem maxime repellat molestias neque quos.'
        }
    }),
    watch: {},
    mounted() {}
}

</script>


<style lang="scss" scoped>

.page.error {
    display: flex;
    align-items: center;
    justify-content: center;

    div {
        font-size: var(--font);
    }
}

</style>