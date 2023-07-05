<template>
    <div class="panel-for-color-picker" ref="root">
        <ul class="colors">
            <li
                :class="{ active: color === value }"
                :style="{ '--color': color }"
                @click="value = color"
            ></li>

            <div></div>

            <li v-for="(color, idx) of _colors" :key="color"
                :class="{ active: color === value }"
                :style="{ '--color': color }"
                @click="value = color"
            ></li>

            <div></div>

            <Icon name="damage-void" style="cursor: pointer;"
                @mouseenter="toolpics.set({ text: 'Reload colors' })"
                @click="rollRandomColors"
            />
        </ul>

        <div style="display: flex; margin: 12px 0 0 0; max-width: 248px; max-height: 200px;">
            <div class="shade">
                <div :style="{ '--color': value, opacity: shade.x < 0 || shade.y < 0 ? 0 : 1 }"></div>
                <canvas id="shade" width="200" height="200"
                    @pointerup="shade.drag = false"
                    @pointerleave="shade.drag = false"
                ></canvas>
            </div>
            <div class="palette">
                <div :style="{ opacity: palette.x < 0 || palette.y < 0 ? 0 : 1  }"></div>
                <canvas id="palette" width="32" height="200"
                    @pointerup="palette.drag = false"
                    @pointerleave="palette.drag = false"
                ></canvas>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

const toolpics = useToolpicsStore();

const root = ref<HTMLElement | null>(null);

const emit = defineEmits(['color']);

const props = defineProps({
    color: { type: String, default: '#ffffff' }
});

const
    value = ref<string>(''),
    paletteColor = ref<string>(''),
    _colors = ref<Array<string>>([]),
    shade = ref({
        drag: false,
        x: -1,
        y: -1
    }),
    palette = ref({
        drag: false,
        x: -1,
        y: -1,
        value: ''
    });

watch(value, (newValue: string, oldValue: string) => {
    if (!oldValue) return;

    emit('color', newValue);
});


function rollRandomColors() {
    _colors.value = colors.randomHexList(5);
}


function initPalette() {
    const
        canvasShare: HTMLCanvasElement = root.value?.querySelector('canvas#shade')!,
        ctxShare = canvasShare?.getContext('2d')!,
        widthShare = canvasShare.width,
        heightShare = canvasShare.height;

    const
        canvasPalette: HTMLCanvasElement = root.value?.querySelector('canvas#palette')!,
        ctxPalette = canvasPalette?.getContext('2d')!,
        widthPalette = canvasPalette.width,
        heightPalette = canvasPalette.height;

    let rgbaColor = 'rgba(255,0,0,1)';

    ctxShare.rect(0, 0, widthShare, heightShare);
    fillGradient();

    ctxPalette.rect(0, 0, widthPalette, heightPalette);

    const grd1 = ctxPalette.createLinearGradient(0, 0, 0, heightPalette)
    grd1.addColorStop(0, 'rgb(255, 0, 0)');
    grd1.addColorStop(0.17, 'rgb(255, 255, 0)');
    grd1.addColorStop(0.34, 'rgb(0, 255, 0)');
    grd1.addColorStop(0.51, 'rgb(0, 255, 255)');
    grd1.addColorStop(0.68, 'rgb(0, 0, 255)');
    grd1.addColorStop(0.85, 'rgb(255, 0, 255)');
    grd1.addColorStop(1, 'rgb(255, 0, 0)');
    ctxPalette.fillStyle = grd1;
    ctxPalette.fill();
            

    function fillGradient() {
        ctxShare.fillStyle = rgbaColor;
        ctxShare.fillRect(0, 0, widthShare, heightShare);

        const grdWhite = ctxPalette.createLinearGradient(0, 0, widthShare, 0);
        grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
        grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
        ctxShare.fillStyle = grdWhite;
        ctxShare.fillRect(0, 0, widthShare, heightShare);

        const grdBlack = ctxPalette.createLinearGradient(0, 0, 0, heightShare);
        grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
        grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
        ctxShare.fillStyle = grdBlack;
        ctxShare.fillRect(0, 0, widthShare, heightShare);
    }

    function changeShadeColor(e?: MouseEvent) {
        if (e) {
            shade.value.x = e.offsetX;
            shade.value.y = e.offsetY;
        }

        var imageData = ctxShare.getImageData(shade.value.x, shade.value.y, 1, 1).data;
        rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';

        value.value = colors.rgbToHex(imageData[0], imageData[1], imageData[2]);
    }

    function changePaletteColor(e: MouseEvent) {
        if (!palette.value.drag) return;
    
        palette.value.x = e.offsetX;
        palette.value.y = e.offsetY;
    
        var imageData = ctxPalette.getImageData(palette.value.x, palette.value.y, 1, 1).data;
    
        rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    
        paletteColor.value = rgbaColor;
    
        fillGradient();
    
        changeShadeColor();
    }

    canvasPalette.addEventListener("pointerdown", (e: MouseEvent) => {
        palette.value.drag = true;

        changePaletteColor(e);
    });

    canvasPalette.addEventListener("pointermove", (e: MouseEvent) => {
        if (!palette.value.drag) return;

        changePaletteColor(e);
    }, false);

    canvasShare.addEventListener("pointerdown", (e: MouseEvent) => {
        shade.value.drag = true;

        changeShadeColor(e);
    }, false);

    canvasShare.addEventListener("pointermove", (e: MouseEvent) => {
        if (!shade.value.drag) return;

        changeShadeColor(e);
    }, false);
}


onMounted(() => {
    value.value = props.color;
        
    rollRandomColors();

    initPalette();
});

</script>

<style lang="scss" scoped>

.panel-for-color-picker {
    position: relative;

    ul.colors {
        display: flex;
        max-width: 100%;
        align-items: center;
        justify-content: space-between;

        div {
            margin: 0 8px 0 0;
            min-width: 1px;
            min-height: 16px;
            background-color: var(--text-secondary);
        }

        li {
            cursor: pointer;
            margin: 0 8px 0 0;
            min-width: 24px;
            height: 24px;
            border-radius: 5px;
            background-color: var(--color);
            transition: .2s;
            outline: solid var(--T);

            &:last-child {
                margin: 0;
            }

            &:hover {
                box-shadow: 0 0 5px 0px var(--color);
            }

            &:active {
                transform: scale(.9);
            }

            &.active {
                border-radius: 50%;
                transform: scale(.55);
                outline: solid 3px var(--color);
                outline-offset: 10px;
            }
        }
    }

    .shade {
        margin: 0 12px 0 0;

        div {
            width: 12px;
            height: 12px;
            top: calc((v-bind('shade.y') * 1px) - 8px);
            left: calc((v-bind('shade.x') * 1px) - 8px);
            border-radius: 50%;
            border: 3px solid #fff;
            background: v-bind(value);
        }
    }

    .palette {
        display: flex;
        justify-content: center;

        div {
            padding: 2px 0;
            width: 24px;
            top: calc(v-bind('palette.y') * 1px);
            border-radius: 25px;
            border: 3px solid #fff;
            background: v-bind(paletteColor);
            box-sizing: border-box;
        }
    }

    .shade,
    .palette {
        position: relative;
        border-radius: 5px;
        transform: scale(.95);
        transition: .2s;
        opacity: .5;
        overflow: hidden;

        &:hover {
            transform: scale(1);
            opacity: 1;
        }

        div {
            pointer-events: none;
            position: absolute;
            transition: background .2s, outline .2s, border .2s, opacity .2s;
            z-index: 1;
        }
    }
}

</style>