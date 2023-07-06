<template>
    <div class="main">
        <div class="hello-world">
            <div class="content">
                <Text class="title" :text="'Title'"/>
                <Text class="text" :text="'Message'"/>
            </div>

            <div class="space">
                The planets are not working at the moment, but soon...
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

// import SpaceOfStars from '../components/content/SpaceOfStars.vue';

useSeoMeta({
    title: 'Home'
});

</script>

<style lang="scss" scoped>

.page.main {
    padding: 0 !important;

    .hello-world {
        width: 100%;
        height: 100%;
        // position: relative;

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

    .space {
        padding: 24px;
        max-width: 70%;
        width: auto;
        position: absolute;
        top: 50%;
        left: 50%;
        color: var(--text-secondary);
        font-size: 20px;
        border: 3px dashed var(--background-secondary);
        border-radius: 5px;
        transform: translate(-50%, -50%);
    }

    @media (max-width: 740px) {
        .hello-world {
            .content {
                .text {
                    max-width: 70vw;
                }
            }
        }
    }

    @media (max-width: 540px) {
        .hello-world {
            .content {
                .text {
                    max-width: 90vw;
                }
            }
        }
    }
}

</style>