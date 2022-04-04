<template>
    <div class="error" @keydown.space="router('/')">
        <div class="content">
            <!-- <div class="table">
                ヘ <br>
                イ <br>
                ト
            </div> -->
            <div class="info">
                <h1 class="glitch font-3" data-glitch="404">404</h1>
                <div class="text">Are you lost?</div>
                <div class="key">space</div>
            </div>
            <Renderer ref="renderer" width="540" height="740" :orbit-ctrl="{ autoRotate: true, enableDamping: true, dampingFactor: 0.05 }">
                <Camera :position="{ z: 1000 }" />
                <Scene background="#34333a">
                    <AmbientLight></AmbientLight>
                    <GltfModel src="/models/mushy_buddy/scene.gltf"/>
                </Scene>
            </Renderer>
        </div>
    </div>
</template>

<script>

export default {
    name: 'ErrorPage',
    components: {},
    computed: {},
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
            min-width: 540px;
            text-align: center;
            border-right: 1px solid var(--dimming);
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