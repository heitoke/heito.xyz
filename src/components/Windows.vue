<template>
    <div class="windows">
        <TransitionGroup name="window">
            <div :class="['window', window.position]" v-for="window of (getListWindows as IWindow[])" :key="window.id" v-show="!window.hide">
                <div class="bg" @click="removeWindow(window.id)"></div>
                <div>
                    <component :is="window.component" class="block" :windowId="window.id" :data="window.data"
                        v-bind="window.props"
                    ></component>

                    <ul class="buttons" v-show="getWindowButtons(window).length > 0">
                        <li v-for="btn of (getWindowButtons(window) as IButton[])" :key="btn.id" :style="{ '--button-color': btn?.color }"
                            @click="btn?.click ? btn?.click($event) : null;"
                            @mouseenter="btn?.text ? setToolpic({ title: btn.text, position: getWinWidth > 540 ? 'left' : 'right' }) : null"
                        >
                            <Icon :name="btn?.icon" />
                        </li>
                    </ul>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import type { IWindow, IButton } from '../store/modules/windows';

export default defineComponent({
    name: 'Windows',
    components: {},
    computed: {
        ...mapGetters(['getWinWidth', 'getListWindows'])
    },
    data: () => ({}),
    watch: {},
    methods: {
        ...mapActions(['setToolpic', 'removeWindow']),
        getWindowButtons(window: IWindow): IButton[] {
            let closeButton: IButton = {
                id: -1,
                text: 'Close',
                icon: 'close',
                color: 'red',
                click: () => {
                    this.removeWindow(window.id);
                }
            }

            return [closeButton, ...window.buttons || []];
        }
    },
    mounted() { }
})

</script>

<style lang="scss" scoped>
.window-enter-active,
.window-leave-active {
    transform: scale(.5);
    opacity: 0;
}

.windows {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 105;

    .window {
        display: flex;
        padding: 5vw 5vh;
        width: 100vw;
        height: 100vh;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        transition: .5s;

        &.top {
            align-items: flex-start;
        }

        &.bottom {
            align-items: flex-end;
        }

        &.left {
            justify-content: flex-start;
        }

        &.right {
            justify-content: flex-end;
        }

        .bg {
            width: 200%;
            height: 200%;
            position: fixed;
            top: -50%;
            left: -50%;
            background-color: #00000095;
            z-index: 1;
        }

        .bg + div {
            padding: 12px;
            position: absolute;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            backdrop-filter: blur(5px);
            z-index: 2;

            &::before {
                content: " ";
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: var(--background-secondary);
                opacity: .5;
                z-index: -1;
            }

            .buttons {
                display: flex;
                position: absolute;
                top: 0;
                left: calc(100% + 12px);
                flex-direction: column;
                transition: all .2s;
                z-index: 3;

                li {
                    cursor: pointer;
                    display: flex;
                    margin: 0 0 8px 0;
                    min-width: 32px;
                    min-height: 32px;
                    border-radius: 5px;
                    align-items: center;
                    justify-content: center;
                    // backdrop-filter: blur(5px);

                    // &::before {
                    //     content: " ";
                    //     width: 100%;
                    //     height: 100%;
                    //     position: absolute;
                    //     top: 0;
                    //     left: 0;
                    //     border-radius: 5px;
                    //     background-color: var(--button-color);
                    //     opacity: .2;
                    //     z-index: -1;
                    // }

                    &:last-child {
                        margin: 0;
                    }

                    i.hx-icon {
                        --color: var(--button-color);
                    }
                }
            }
        }
    }
}
</style>