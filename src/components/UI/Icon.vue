<template>
    <!-- <i :class="['hx-icon', `i-${name}`, { loading: !icon }]"
        :style="{
            '--size': size,
            '--w': w ? w : 'var(--size)',
            '--h': h ? h : 'var(--size)',
            '--icon': `url('${icon}')`
        }"
    ></i> -->
    <i :class="`hx-icon i-${name}`"></i>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UIIcon',
    computed: {},
    props: {
        name: {
            type: String
        },
        // size: {
        //     type: String,
        //     default: '16px'
        // },
        // w: {
        //     type: String
        // },
        // h: {
        //     type: String
        // }
    },
    data: () => ({
        // icon: ''
    }),
    watch: {
        // name(newValue: string) {
        //     this.setIcon(newValue);
        // }
    },
    methods: {
        // async setIcon(name: string) {
        //     if (!name) return;

        //     let module = await import(`../../assets/icons/${name}.svg`);
        
        //     let icon = new Image();
        //     icon.src = module.default.replace(/^\/@fs/, '');
        //     icon.onload = () => {
        //         this.icon = icon.src;
        //     }
        // }
    },
    mounted() {
        // this.setIcon(this.name as string);
    }
});

</script>

<style lang="scss" scoped>

i.hx-icon {
    color: var(--text-primary);
    font-size: 16px;
    // --color: var(--text-primary);
    // display: inline-block;
    // min-width: var(--w); 
    // min-height: var(--h);
    // position: relative;
    // background-color: var(--color);
    // -webkit-mask-size: cover;
    // mask-size: cover;
    // -webkit-mask-image: var(--icon);
    // mask-image: var(--icon);
    // transition: .2s;

    // &.loading {
    //     -webkit-mask-image: none;
    //     mask-image: none;
    //     border-radius: 50%;
    //     background-color: var(--background-secondary);
    // }
}

</style>