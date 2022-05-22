<template>
    <div class="error" @keydown.space="router('/')">
        <div class="content">
            <div class="info">
                <h1 class="glitch font-3" data-glitch="404">404</h1>
                <div class="text">Are you lost?</div>
                <div class="key" @click="router('/')">space</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'ErrorPage',
    components: {},
    computed: {},
    props: {},
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss">

.page.error {
    .content {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;

        .info {
            display: flex;
            text-align: center;
            align-items: center;
            flex-direction: column;

            h1 {
                margin: 0 0 4px 0;
                font-size: 128px;
            }

            .text {
                color: var(--color-2);
            }

            .key {
                margin: 8px 0 0 0;
            }
        }
    }
}

</style>