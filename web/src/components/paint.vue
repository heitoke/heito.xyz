<template>
    <div class="main-paint">
        <div class="menu">
            <div :class="{ 'button': true, open: menu.open }" @click="menu.open = !menu.open">
                <i class="uil uil-angle-right-b"></i>
            </div>
            <ul v-if="menu.open">
                <li class="color" :data-ui-title="color" :style="{ 'background': color }" ui-title="Цвет" uit-bottom>
                    <input type="color" v-model="color">
                </li>
                <li class="range" :ui-title="`Размер кисти: ${lineWidth}`" uit-bottom>
                    <input type="range" min="1" max="100" v-model="lineWidth">
                </li>
                <li class="remove" ui-title="Очистить" uit-bottom @click="resetCanvas()">
                    <i class="uil uil-trash"></i>
                </li>
                <li class="download" ui-title="Скачать" uit-bottom @click="downloadImage()">
                    <i class="uil uil-file-download"></i>
                </li>
            </ul>
        </div>
        <div class="close" @click="setPaint(false)">
            <i class="uil uil-multiply"></i>
        </div>
        <canvas id="main-paint" ref="canvas" :width="size.w" :height="size.h">Ваш браузер устарел!</canvas>
    </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'MainHeader',
    computed: mapGetters(['getTheme', 'isPaint', 'getPaint']),
    data() {
        return {
            ctx: null,
            canvas: null,
            lineWidth: 1,
            color: '#000000',
            size: {
                w: window.screen.width,
                h: window.screen.height
            },
            menu: {
                open: false
            }
        }
    },
    methods: {
        ...mapActions(['setTheme', 'setPaint']),
        resetCanvas(clear) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            if (!clear) localStorage.setItem('paint', '')
        },
        setPaintImage() {
            this.resetCanvas(true)
            let image = new Image();
            image.src = localStorage.getItem('paint');
            image.onload = () => this.ctx.drawImage(image, 0, 0);
        },
        downloadImage() {
            this.redirect(this.canvas.toDataURL('image/png'))
        }
    },
    mounted() {

        window.onresize = () => {
            this.size = { w: window.screen.width, h: window.screen.height }
            this.setPaintImage()
        }

            // let _miniCanvas = document.getElementById('main-paint')

        let canvas = this.canvas = this.$refs.canvas
        let ctx = this.ctx = canvas.getContext("2d");
        let coord = { x: 0, y: 0 };
        let draw = false

        const reposition = e => {
            coord.x = e.offsetX
            coord.y = e.offsetY
        }

        if (localStorage['paint']) this.setPaintImage()

        window.onmousedown = () => draw = true;
        window.onmouseup = () => {
            draw = false
            localStorage.setItem('paint', canvas.toDataURL('image/png'));    
        };

        const data = () => this

        canvas.onmousedown = (event) => {
            reposition(event);
            canvas.onmousemove = (event) => {
                if (!draw) return
                ctx.beginPath();
                ctx.lineWidth = data().lineWidth;
                ctx.lineCap = "round";
                ctx.strokeStyle = data().color;
                ctx.moveTo(coord.x, coord.y);
                reposition(event);
                ctx.lineTo(coord.x, coord.y);
                ctx.stroke();
            }
        }

    }
}

</script>

<style lang="scss">

.main-paint {
    position: fixed;
    top: 0;
    left: 0;
    animation: ShowPaint 1s;
    background: #fff;
    z-index: 102;

    .menu {
        display: flex;
        height: 32px;
        position: absolute;
        top: 8px;
        left: 8px;
        color: #e8e8e8;
        align-items: center;
        background: #00000095;

        .button {
            cursor: pointer;
            width: 32px;
            height: 32px;
            font-size: 20px;
            text-align: center;
            line-height: 32px;
            transition: .2s;

            &.open {
                transform: rotate(180deg);
            }
        }

        ul {
            display: flex;
            align-items: center;

            .color {
                margin: 0 4px;
                width: 24px;
                height: 24px;
                border-radius: 50%;

                input {
                    opacity: 0;
                    z-index: -1;
                }
            }

            .range {
                margin: 0 8px 0 0;
                transform: translateY(2px);
            }

            .remove,
            .download {
                cursor: pointer;
                margin: 0 8px 0 0;
            }
            .remove {
                color: var(--C5);
            }
            .download {
                color: var(--C2);
            }
            
        }
    }

    .close {
        cursor: pointer;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 48px;
        left: 8px;
        color: #e8e8e8;
        text-align: center;
        line-height: 32px;
        background: #00000095;
        
        &:active {
            transform: scale(.9);
        }
    }
}

@keyframes ShowPaint {
    from {
        top: 100%;
        overflow: 0;
    }
}

</style>
