<template>
    <!-- <div class="pie-chart" :style="{ '--size': size }">
        <div class="slice" v-for="(slice, idx) of listData" :key="slice.value"
            :style="{ '--transform': `rotate(${slice.offset - 1}deg) translate3d(0, 0, 0)` }"
        >
            <div :style="{
                transform: `rotate(${-179 + (slice.value / totalData) * 360}deg) translate3d(0, 0, 0)`,
                'background-color': slice.color
            }">{{ slice.value }}</div>
        </div>
    </div> -->
    <canvas id="can" width="200" height="200" />
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue';

import { createHex } from '../../libs/functions';

interface IData {
    totalData: number;
    listData: Array<{ value: number; offset: number; color: string; }>;
}

export default defineComponent({
    name: 'PieChart',
    computed: {},
    props: {
        size: {
            type: String,
            default: '200px'
        },
        numbers: {
            type: Array as PropType<Array<number>>,
            default: [1, 2, 3, 4, 5]
        }
    },
    data(): IData {
        return {
            totalData: 0,
            listData: []
        }
    },
    watch: {},
    methods: {},
    mounted() {
        // this.totalData = this.numbers.reduce((a, b) => a + b, 0);

        // let offset = 0;
        // for (let i = 0; i < this.numbers.length; i++) {
        //     this.listData = [...this.listData || [], {
        //         value: this.numbers[i],
        //         offset,
        //         color: createHex()
        //     }];
            
        //     offset += (this.numbers[i] / this.totalData) * 360;
        // }
        let canvas = document.querySelector('canvas');
//         console.log(canvas);
        
// var ctx = canvas.getContext("2d");
// var lastend = 0;
// var data = this.numbers
// var myTotal = 0;
// var myColor = ['#afcc4c', '#95b524','#c1dd54'];
// var labels = ['B', 'A', 'C'];

// for(var e = 0; e < data.length; e++)
// {
//   myTotal += data[e];
// }

// // make the chart 10 px smaller to fit on canvas
// var off = 0
// var w = canvas.width / 2
// var h = canvas.height / 2
// for (var i = 0; i < data.length; i++) {
//   ctx.fillStyle = createHex();
//   ctx.strokeStyle ='transparent';
//   ctx.lineWidth = 0;
//   ctx.beginPath();
//   ctx.moveTo(w,h);
//   var len =  (data[i]/myTotal) * 2 * Math.PI
//   var r = h / 2
//   ctx.arc(w + 1, h, h - 0 / 2, lastend,lastend + len,false);
//   ctx.lineTo(w,h);
//   ctx.fill();
// //   ctx.stroke();
// //   ctx.fillStyle ='white';
// //   ctx.font = "20px Arial";
// //   ctx.textAlign = "center";
// //   ctx.textBaseline = "middle";
// //   var mid = lastend + len / 2
// //   ctx.fillText(labels[i],w + Math.cos(mid) * (r/2) , h + Math.sin(mid) * (r/2));
//   lastend += Math.PI*2*(data[i]/myTotal);
// }
var results = [
  {name: 'Satisfied', count: 1043, color: 'lightblue'},
  {name: 'Neutral', count: 563, color: 'lightgreen'},
  {name: 'Unsatisfied', count: 510, color: 'pink'},
  {name: 'No comment', count: 175, color: 'silver'}
]

var cx = document.querySelector('canvas')!.getContext('2d')!;
var total = results.reduce(function(sum, choice) {
  return sum + choice.count;
}, 0);

//start at the top
var currentAngle = 1.5 * Math.PI;
var centerX = 100,
    centerY = 100;

results.forEach(function(result) {
  var sliceAngle = (result.count / total) * 2 * Math.PI;
  
  // pie slices
  cx.beginPath();
  cx.arc(centerX, centerY, 100, currentAngle, currentAngle + sliceAngle);
  currentAngle += sliceAngle;
  cx.lineTo(centerX, centerY);
  cx.fillStyle = result.color;
  cx.fill();
});
    }
})

</script>

<style lang="scss" scoped>

.pie-chart {
    width: 200px;
    height: 200px;
    position: relative;
    vertical-align: top;

    // &::before {
    //     content: "";
    //     display: block;
    //     width: calc(var(--size) / 2);
    //     height: calc(var(--size) / 2);
    //     position: absolute;
    //     top: calc(var(--size) / 4);
    //     left: calc(var(--size) / 4);
    //     border-radius: 50%;
    //     background: var(--background-primary);
    //     transition: .2s;
    //     z-index: 1;
    // }

    .slice {
        position: absolute;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        transform: var(--transform);
        animation: bake-pie 1s;
        transition: .2s;
        clip: rect(0px, var(--size), var(--size), calc(var(--size) / 2));
        overflow: hidden;

        div {
            display: block;
            width: var(--size);
            height: var(--size);
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 50%;
            background-color: black;
            transform: var(--transform);
            transition: .2s;
            clip: rect(0px, var(--size), var(--size), calc(var(--size) / 2));
        }
    }

    @keyframes bake-pie {
        from {
            transform: rotate(0deg) translate3d(0, 0, 0);
        }
    }
}

</style>