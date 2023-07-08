<template>
    <div class="windows">
        <TransitionGroup name="window">
            <div v-for="window of windows.getList" :key="window?.id"
                v-show="!window?.hide"
                :class="['window', window?.position]" 
            >
                <div class="bg" @click="window?.close ? windows.close(window?.id!) : null"></div>
                
                <div class="blur">
                    <ScrollBar>
                        <component :is="window?.component" class="block" :windowId="window?.id" :data="window?.data" v-if="!window?.error"
                            style="padding: 12px;"
                            :closeWindow="() => windows.close(window?.id!)"
                            v-bind="window?.props"
                            @error="window.error = true"
                        ></component>

                        <div class="error" v-else>
                            <Text :text="'Произошла ошибка при загрузки'"/>
                            <Button>Перезагрузить</Button>
                        </div>
                    </ScrollBar>

                    <ul class="buttons" v-show="getWindowButtons(window).length > 0">
                        <li v-for="btn of (getWindowButtons(window) as IButton[])" :key="btn.icon"
                            :style="{ '--button-color': btn?.color || 'var(--text-primary)' }"
                            @click="btn?.click ? btn?.click($event) : null;"
                            @mouseenter="btn?.label ? toolpics.set({ title: btn.label, position: $win.size.width > 540 ? 'left' : 'right' }) : null"
                        >
                            <Icon :name="btn?.icon" :style="{ color: btn?.color }"/>
                        </li>
                    </ul>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script lang="ts" setup>

import ScrollBar from '~/components/content/ScrollBar.vue';

import type { IWindow, IButton } from '~/types/stores/windows';

const
    windows = useWindowsStore(),
    toolpics = useToolpicsStore();

function getWindowButtons(window: IWindow): Array<IButton> {
    let closeButton: IButton = {
        label: 'Close',
        icon: 'close',
        color: 'red',
        click: () => {
            windows.close(window?.id!);
        }
    }

    return [window?.close ? closeButton : {} as IButton, ...(window?.buttons || [])];
}

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
        position: fixed;
        top: 0;
        left: 0;
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
            // padding: 12px;
            position: absolute;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
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

            :deep(.scrollbar) {
                [scrollbar-body] {
                    max-height: 90vh;
                }
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

            @media (max-width: 512px) {
                max-width: calc(100% - 48px) !important;

                .buttons {
                    top: -48px;
                    right: 12px;
                    flex-direction: row-reverse;

                    li {
                        margin: 0 8px 0 0;
                    }
                }
            }
        }
    }
}
</style>