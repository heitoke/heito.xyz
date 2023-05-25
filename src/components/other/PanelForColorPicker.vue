<template>
    <div class="panel-for-color-picker">
        <ul class="colors">
            <li
                :class="{ active: color === value }"
                :style="{ '--color': color }"
                @click="value = color"
            ></li>

            <div></div>

            <li v-for="(color, idx) of colors" :key="color"
                :class="{ active: color === value }"
                :style="{ '--color': color }"
                @click="value = color"
            ></li>

            <div></div>

            <Icon name="damage-void" style="cursor: pointer;"
                @mouseenter="setToolpic({ text: 'Reload colors' })"
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

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { colors } from '../../libs/utils';
import { mapActions } from 'vuex';

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
        paletteColor: '',
        colors: [] as string[],
        shade: {
            drag: false,
            x: -1,
            y: -1
        },
        palette: {
            drag: false,
            x: -1,
            y: -1,
            value: ''
        }
    }),
    watch: {
        'value'(newValue, oldValue) {
            if (!oldValue) return;

            this.$emit('color', newValue);
        }
    },
    methods: {
        ...mapActions(['setToolpic']),
        rollRandomColors() {
            this.colors = colors.randomHexList(5);
        },
        initPalette() {
            const canvasShare: HTMLCanvasElement = (this.$el as Element).querySelector('canvas#shade')!;
            const ctxShare = canvasShare?.getContext('2d')!;
            const widthShare = canvasShare.width;
            const heightShare = canvasShare.height;
            
            const canvasPalette: HTMLCanvasElement = (this.$el as Element).querySelector('canvas#palette')!;
            const ctxPalette = canvasPalette?.getContext('2d')!;
            const widthPalette = canvasPalette.width;
            const heightPalette = canvasPalette.height;

            var rgbaColor = 'rgba(255,0,0,1)';

            ctxShare.rect(0, 0, widthShare, heightShare);
            fillGradient();

            ctxPalette.rect(0, 0, widthPalette, heightPalette);
            var grd1 = ctxPalette.createLinearGradient(0, 0, 0, heightPalette)
            grd1.addColorStop(0, 'rgb(255, 0, 0)');
            grd1.addColorStop(0.17, 'rgb(255, 255, 0)');
            grd1.addColorStop(0.34, 'rgb(0, 255, 0)');
            grd1.addColorStop(0.51, 'rgb(0, 255, 255)');
            grd1.addColorStop(0.68, 'rgb(0, 0, 255)');
            grd1.addColorStop(0.85, 'rgb(255, 0, 255)');
            grd1.addColorStop(1, 'rgb(255, 0, 0)');
            ctxPalette.fillStyle = grd1;
            ctxPalette.fill();

            // function findPositionColor(ctx: CanvasRenderingContext2D, r: number, g: number, b: number): [number, number] {
            //     let x, y;

            //     for (let i = 0; i < ctx.canvas.height; i++) {
            //         for (let j = 0; j < ctx.canvas.width; j++) {
            //             const color = ctx.getImageData(j, i, 1, 1).data;
            //             if (color[0] === r && color[1] === g && color[2] === b) {
            //                 x = j;
            //                 y = i;
            //                 return [x, y];
            //             }
            //         }
            //     }

            //     return [-1, -1];
            // }

            // let [r, g, b] = colors.hexToRgb(this.value);
            // console.log('a', r, g, b);
            
            // let [x, y] = findPositionColor(ctxPalette, r, g, b);
            // console.log('c', x, y);
            
            // let a = ctxPalette.getImageData(x, y, 1, 1).data;
            // console.log('b', a[0], a[1], a[2]);
            
            // console.log(rgbToHex(a[0], a[1], a[2]));
            

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

            
            

            const changeShadeColor = (e?: MouseEvent) => {
                if (e) {
                    this.shade.x = e.offsetX;
                    this.shade.y = e.offsetY;
                }

                var imageData = ctxShare.getImageData(this.shade.x, this.shade.y, 1, 1).data;
                rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';

                this.value = colors.rgbToHex(imageData[0], imageData[1], imageData[2]);
            }

            const changePaletteColor = (e: MouseEvent) => {
                if (!this.palette.drag) return;
    
                this.palette.x = e.offsetX;
                this.palette.y = e.offsetY;
    
                var imageData = ctxPalette.getImageData(this.palette.x, this.palette.y, 1, 1).data;
    
                rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    
                this.paletteColor = rgbaColor;
    
                fillGradient();
    
                changeShadeColor();
            }

            canvasPalette.addEventListener("pointerdown", (e: MouseEvent) => {
                this.palette.drag = true;

                changePaletteColor(e);
            });

            canvasPalette.addEventListener("pointermove", (e: MouseEvent) => {
                if (!this.palette.drag) return;

                changePaletteColor(e);
            }, false);

            canvasShare.addEventListener("pointerdown", (e: MouseEvent) => {
                this.shade.drag = true;

                changeShadeColor(e);
            }, false);

            canvasShare.addEventListener("pointermove", (e: MouseEvent) => {
                if (!this.shade.drag) return;

                changeShadeColor(e);
            }, false);
        }
    },
    mounted() {
        this.value = this.color;
        
        this.rollRandomColors();

        this.initPalette();
    }
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