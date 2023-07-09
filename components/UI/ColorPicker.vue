<template>
    <div class="ui-color-picker">
        <header ref="header" @click="open">
            <div class="color" :style="{ 'background-color': `#${color}` }"></div>
            
            <label @click.prevent.stop="($event.target as any).focus()">
                <input type="text" v-model="color"
                    maxlength="6"
                    :placeholder="text || value.replace('#', '')"
                    @keypress="keypress"
                >
            </label>

            <div class="button">
                <Icon name="arrow-down"/>
            </div>
        </header>
    </div>
</template>

<script lang="ts" setup>

import PanelForColorPicker from '~/components/other/PanelForColorPicker.vue';

const header = ref<HTMLElement | null>(null);

const emit = defineEmits(['color']);

const contextMenu = useContextMenusStore();

const props = defineProps({
    value: { type: String, default: 'ffffff' },
    text: { type: String }
});

const color = ref<string>('ffffff');

watch(() => props.value, (newValue: string) => {
    color.value = newValue.slice(1);
});

watch(color, (newValue: string) => {
    emit('color', `#${newValue}`);
});

function keypress(e: KeyboardEvent) {
    let value = (e.target as any)?.value + e.key;

    if (!/[a-f0-9]$/i.test(value)) {
        e.preventDefault();
    }
}

function open() {
    contextMenu.create({
        name: 'color-picker',
        position: ['bottom', 'fixed-target', 'center'],
        event: header.value!,
        autoMaxWidth: true,
        components: [
            {
                component: PanelForColorPicker,
                name: 'panel-for-color-picker',
                props: {
                    color: props.value
                },
                events: {
                    color: (newColor: string) => {
                        color.value = newColor.slice(1);
                    }
                }
            }
        ]
    });
}


onMounted(() => {
    color.value = props.value.slice(1);
});

</script>

<style lang="scss" scoped>

.ui-color-picker {
    position: relative;

    header {
        display: flex;
        position: relative;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        .color {
            cursor: pointer;
            width: 64px;
            height: 32px;
            // border-radius: 0 5px 5px 0;
            // border-right: 1px solid var(--background-secondary);
            transition: .2s;
        }

        label {
            display: flex;
            max-width: 169px;
            min-width: 169px;
            // width: calc(100% - 96px);
            position: relative;
            align-items: center;
            box-sizing: border-box;

            input {
                padding: 7px 12px 7px 20px;
                color: var(--text-primary);
                text-transform: uppercase;
                border: none;
                background-color: var(--T);
                box-sizing: border-box;
                outline: none;
            }

            &::before {
                content: "#";
                position: absolute;
                left: 8px;
                color: var(--text-secondary);
                opacity: .7;
            }
        }
        
        .button {
            cursor: pointer;
            display: flex;
            min-width: 32px;
            height: 32px;
            // border-radius: 5px;
            border-left: 1px solid var(--background-secondary);
            align-items: center;
            justify-content: center;
            transition: .2s;
            z-index: 1;
        }
    }
}

</style>