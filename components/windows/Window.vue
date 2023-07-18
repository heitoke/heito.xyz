<template>
    <div :class="['window', window?.position]" v-show="!window?.hide">
        <div class="bg" @click="window?.close?.enable ? windows.close(window?.id!) : null"></div>

        <div class="blur">
            <ScrollBar>
                <component class="block" v-if="!window?.error"
                    :is="windowComponent(window.component)"
                    :windowId="window?.id"
                    :data="window?.data"
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

            <Buttons v-show="getWindowButtons?.length! > 0"
                :buttons="getWindowButtons"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import ScrollBar from '~/components/content/ScrollBar.vue';

import Buttons from './Buttons.vue';

import type { IWindow } from '~/types/stores/windows';

const windows = useWindowsStore();


const props = defineProps({
    window: {
        type: Object as PropType<IWindow>,
        required: true
    }
});


const getWindowButtons = computed(() => {
    const { id, close, buttons: _buttons } = props.window!;

    let buttons = _buttons;

    if (close?.enable && close?.button) {
        buttons = [
            {
                label: 'Close window',
                icon: 'close',
                color: 'var(--red)',
                click: () => windows.close(id!)
            },
            ..._buttons || []
        ];
    }

    return buttons || [];
});


function windowComponent(name: string) {
    return resolveComponent(name);
}

</script>

<style lang="scss" scoped>

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

</style>