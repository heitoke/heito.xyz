<template>
    <div>{{ value }}</div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

interface IData {
    value: string;
    timer: any;
    n: number;
}

export default defineComponent({
    name: 'UIText',
    computed: {},
    props: ['text'],
    data(): IData {
        return {
            value: '',
            timer: null,
            n: 0
        }
    },
    watch: {
        'text'(newValue) {
            this.n = 0;
            this.value = '';
            clearInterval(this.timer);
            this.timer = setInterval(async () => {
                this.value += this.text[this.n++];
                if (this.n >= this.text.length) clearInterval(this.timer);
            }, Math.round(1000 / this.text?.length));
        }
    },
    methods: {},
    mounted() {
        this.value = this.text;
    }
});

</script>

<style lang="scss" scoped>

</style>