<template>
    <div class="super-settings">
        <div class="title">Settings</div>
        <!-- <ul class="nav-bar">
            <li v-for="btn of sections" :key="btn"
                :class="{ active: section === btn.name }" @click="section = btn.name"
            >{{ btn.label }}</li>
        </ul> -->
        <section v-if="section === 'interface'">
            <div class="block">
                <div h>
                    <div class="title">Profile</div>
                    <div class="description">Whether to display the profile icon. To do this, you need to log in.</div>
                </div>
                <Check :value="getLocal?.profile" @onEvent="setLocal(['profile', $event])"/>
            </div>
            <!-- <div class="block">
                <div h>
                    <div class="title">Models</div>
                    <div class="description">Do you want to see 3D models on the site? <br> (Loads the system much more)</div>
                </div>
                <Check :value="getLocal?.models" @onEvent="setLocal(['models', $event])"/>
            </div> -->
        </section>
    </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
    name: 'SettingsMenu',
    components: {},
    computed: {},
    data() {
        return {
            // colors: [
            //     "#7579ff",
            //     "#00d38f",
            //     "#ffde5a",
            //     "#ff4e33",
            //     "#f64072",
            //     "#ffb433",
            //     "#0292E0",
            //     "#CC66FF",
            // ],
            section: 'interface',
            // sections: [
            //     { label: 'Interface', name: 'interface' },
            //     { label: 'Appearance', name: 'appearance' }
            // ]
        }
    },
    methods: {
        ...mapActions(['setColor']),
        randomHex(count = 8) {
            let create = () => `#${Math.round((0x1000000 + 0xffffff * Math.random())).toString(16).slice(1)}`;
            return new Array(count).fill(1).map(() => create());
        }
    },
    mounted() {}
}
</script>

<style lang="scss" scoped>

.block.super-settings {
    padding: 12px;
    min-width: 320px;
    overflow-x: hidden;

    .title {
        text-align: left;
    }

    .nav-bar {
        margin: 0;
    }

    .block {
        display: flex;
        margin: 8px 0;
        padding-bottom: 8px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--dimming);

        &:last-child {
            padding-bottom: 0;
            border-bottom: none;
        }

        div[h] {
            width: 100%;
            max-width: 90% !important;
        }
        div[hh] {
            width: 100%;
            max-width: 100% !important;
        }

        .title {
            margin: 4px 0;
            font-size: 14px;
        }

        .description {
            max-width: 80%;
            color: var(--color-2);
            font-size: 14px;
        }

        &.images ul {
            display: flex;
            margin: 8px 0 0 0;
            max-width: 840px;
            width: 100%;
            // flex-wrap: wrap;
            column-gap: 8px;
            // row-gap: 8px;
            overflow: hidden;
            user-select: none;

            li {
                cursor: pointer;
                min-width: 96px;
                height: 64px;
                position: relative;
                text-align: center;
                border-radius: 5px;
                background-size: cover;
                background-position: 50% 50%;
                transition: .2s;
                overflow: hidden;

                &:hover, &.active {
                    box-shadow: 0 0 5px -1px #000;
                }

                &:active, &.active {
                    transform: scale(.8);
                }

                i {
                    color: var(--color-2);
                    font-size: 32px;
                    line-height: 64px;
                }

                &:last-child {
                    margin-right: 0;
                }

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        &.colors {
            
            .field-text {
                color: var(--main-color);
            }

            ul {
                display: flex;
                margin: 8px 0 0 0;
                width: 100%;
                flex-wrap: wrap;

                li {
                    cursor: pointer;
                    margin-right: 8px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-size: cover;
                    transition: .2s;

                    &:hover, &.active {
                        border-radius: 5px;
                        transform: rotate(45deg) scale(.8);
                    }

                    &:active, &.active {
                        transform: rotate(135deg) scale(.6);
                    }

                    i {
                        color: var(--color-2);
                        font-size: 32px;
                        line-height: 64px;
                    }

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }

        click {
            cursor: pointer;
            color: var(--color-3);
            transition: .2s;
            user-select: none;

            &:hover {
                color: var(--C1);
                text-decoration: underline;
            }
        }
    }
}

</style>