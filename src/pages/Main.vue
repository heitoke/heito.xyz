<template>
    <div class="main">
        <!-- <M/> -->
        <div class="hello-world">
            <div class="content">
                <RouterLink to="/projects">Projects</RouterLink>
                <RouterLink to="/blogs">Blogs</RouterLink>
                
                <!-- <div class="title">{{ text }}</div> -->
                <Text class="title" :text="getLang.page.main.title"/>
                <Text class="text" :text="getLang.page.main.text"/>
            </div>
        </div>
        <div style="height: 100vh;"></div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

export default defineComponent({
    name: 'MainPage',
    components: {},
    computed: {
        ...mapGetters(['getLang'])
    },
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
        width: 100vw;
        height: 100vh;
        position: relative;

        .content {
            position: absolute;
            left: 5vw;
            bottom: 5vh;

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