<template>
    <div class="main">
        <div class="hello-world">
            <div class="content">
                <Text class="title" :text="$lang.params.page.main.title"/>
                <Text class="text" :text="$lang.params.page.main.text"/>
            </div>
            <Suspense>
                <SpaceOfStars/>
            </Suspense>
        </div>
    </div>
</template>

<script lang="ts" setup>

import SpaceOfStars from '../components/content/SpaceOfStars.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'MainPage',
    components: {},
    computed: {},
    props: {},
    data: () => ({}),
    watch: {},
    methods: {},
    mounted() {}
});

</script>

<style lang="scss" scoped>

.page.main {
    padding: 0 !important;

    .hello-world {
        width: 100%;
        height: 100%;
        position: relative;

        .content {
            position: absolute;
            left: 5%;
            bottom: 5%;
            z-index: 1;

            .title {
                font-size: clamp(32px, calc(var(--font) - 4vmin), 90px);
                text-transform: uppercase;
                letter-spacing: .07em;
            }

            .text {
                max-width: 35vw;
                font-size: clamp(16px, calc(var(--font) - 8vmin), 48px);
                letter-spacing: .03em;
            }
        }
    }
}

</style>