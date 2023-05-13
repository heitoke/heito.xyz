<template>
    <div class="panel-for-color-picker">
        <ul class="colors">
            <li v-for="(color, idx) of colors" :key="color"
                :class="{ active: color === value }"
                :style="{ '--color': color }"
                @click="value = color"
            ></li>
        </ul>

        <div style="display: flex; margin: 12px 0 0 0; max-width: 248px; max-height: 200px;">
            <div class="shade">
                <div :style="{ '--color': getAltColor(value), opacity: shade.x < 0 || shade.y < 0 ? 0 : 1 }"></div>
                <canvas id="shade" width="200" height="200"></canvas>
            </div>
            <div class="palette">
                <div :style="{ opacity: palette.x < 0 || palette.y < 0 ? 0 : 1  }"></div>
                <canvas id="palette" width="32" height="200"></canvas>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { randomHexList, rgbToHex, getAltColor } from '../../libs/functions';

export default defineComponent({
    name: 'PanelForColorPicker',
    computed: {},
    props: {
        color: {
            type: String,
            default: '#ffffff'
        }
    },
    data: () => ({
        value: '',
        colors: [] as string[],
        shade: {
            x: -1,
            y: -1
        },
        palette: {
            x: -1,
            y: -1,
            value: ''
        }
    }),
    watch: {
        'value'(newValue, oldValue) {
            if (newValue === this.color) return;

            this.$emit('color', newValue);
        }
    },
    methods: {
        getAltColor,
        initPalette() {
            const canvasShare: HTMLCanvasElement = (this.$el as Element).querySelector('canvas#shade')!;
            const ctxShare = canvasShare?.getContext('2d')!;
            const widthShare = canvasShare.width;
            const heightShare = canvasShare.height;
            
            const canvasPalette: HTMLCanvasElement = (this.$el as Element).querySelector('canvas#palette')!;
            const ctxPalette = canvasPalette?.getContext('2d')!;
            const widthPalette = canvasPalette.width;
            const heightPalette = canvasPalette.height;

            var drag = false;
            let dragPalette = false;
            var rgbaColor = 'rgba(255,0,0,1)';

            ctxShare.rect(0, 0, widthShare, heightShare);
            fillGradient();

            ctxPalette.rect(0, 0, widthPalette, heightPalette);
            var grd1 = ctxPalette.createLinearGradient(0, 0, 0, heightPalette)
            grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
            grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
            grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
            grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
            grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
            grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
            grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
            ctxPalette.fillStyle = grd1;
            ctxPalette.fill();

            function fillGradient() {
                ctxShare.fillStyle = rgbaColor;
                ctxShare.fillRect(0, 0, widthShare, heightShare);

                var grdWhite = ctxPalette.createLinearGradient(0, 0, widthShare, 0);
                grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
                grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
                ctxShare.fillStyle = grdWhite;
                ctxShare.fillRect(0, 0, widthShare, heightShare);

                var grdBlack = ctxPalette.createLinearGradient(0, 0, 0, heightShare);
                grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
                grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
                ctxShare.fillStyle = grdBlack;
                ctxShare.fillRect(0, 0, widthShare, heightShare);
            }

            const changeColor = (e?: MouseEvent) => {
                if (e) {
                    this.shade.x = e.offsetX;
                    this.shade.y = e.offsetY;
                }

                var imageData = ctxShare.getImageData(this.shade.x, this.shade.y, 1, 1).data;
                rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
                
                this.value = rgbToHex(imageData[0], imageData[1], imageData[2]);

            }

            canvasPalette.addEventListener("mousedown", () => dragPalette = true, false);
            canvasPalette.addEventListener("mouseup", () => dragPalette = false, false);
            canvasPalette.addEventListener('mouseleave', () => dragPalette = false, false);
            canvasPalette.addEventListener("mousemove", (e: MouseEvent) => {
                if (!dragPalette) return;

                this.palette.x = e.offsetX;
                this.palette.y = e.offsetY;

                var imageData = ctxPalette.getImageData(this.palette.x, this.palette.y, 1, 1).data;

                rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';

                fillGradient();

                changeColor()
            }, false);

            canvasShare.addEventListener("mousedown", (e: MouseEvent) => {
                drag = true;
                changeColor(e);
            }, false);

            canvasShare.addEventListener("mouseup",() => drag = false, false);
            canvasShare.addEventListener('mouseleave', () => drag = false, false);

            canvasShare.addEventListener("mousemove", (e: MouseEvent) => {
                if (!drag) return;

                changeColor(e);
            }, false);
        }
    },
    mounted() {
        this.value = this.color;
        
        this.colors = randomHexList(8);

        this.initPalette();
    }
});

</script>

<style lang="scss" scoped>

.panel-for-color-picker {
    ul.colors {
        display: flex;
        align-items: center;

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
            width: 4px;
            height: 4px;
            top: calc(v-bind('shade.y') * 1px);
            left: calc(v-bind('shade.x') * 1px);
            border-radius: 50%;
            background: v-bind(getAltColor(value));
            outline-offset: 10px;
            outline: solid 3px v-bind(getAltColor(value));
        }
    }

    .palette {
        div {padding: 2px 0;
            width: 100%;
            top: calc(v-bind('palette.y') * 1px);
            border-radius: 25px;
            border: 2px solid v-bind(getAltColor(value));
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