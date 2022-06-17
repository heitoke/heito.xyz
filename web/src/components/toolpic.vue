<template>
    <transition enter-active-class="toolpic-show" leave-active-class="toolpic-hide">
        <div :class="`toolpic ${getToolpic?.type}`" ref="toolpic" v-if="getToolpic?.isActive"
            :style="{ top: `${y}px`, left: `${x}px` }"
        >
            {{ getToolpic?.text }}
        </div>
    </transition>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
    name: 'MainToolpic',
    computed: {
        ...mapGetters(['getToolpic'])
    },
    props: {},
    data() {
        return {
            xy: -10000000000,
            x: 0,
            y: 0
        }
    },
    watch: {
        'getToolpic.isActive'(newToolpic) {
            if (!newToolpic) return 
            let event = window.event;
            setTimeout(() => this.setPosition(event, this.getToolpic?.type), 201);
        }
    },
    methods: {
        setPosition(event, type) {
            let elPos = event.target.getBoundingClientRect(),
                el = this.$refs?.toolpic?.getBoundingClientRect(),
                has = val => type.split(' ').includes(val),
                x = elPos.x,
                y = elPos.y;

            if (!el) return;
            
            if (has('top')) y = y - 6 - el.height;
            if (has('bottom')) y = y + 14 + el.height;
            if (has('top') || has('bottom')) x = x - (el.width / 2) + (elPos.width / 2);

            if (has('left')) x = x - 8 - el.width;
            if (has('right')) x = x + 8 + elPos.width;
            if (has('left') || has('right')) y = y - (el.height / 2) + (elPos.height / 2);

            this.x = x;
            this.y = y;
        }
    },
    mounted() {}
}
</script>

<style lang="scss" scoped>

.toolpic {
    padding: 4px 8px;
    max-width: 256px;
    min-width: auto !important;
    position: absolute;
    font-size: 14px;
    text-align: center;
    border-radius: 5px;
    border: 1px solid var(--T);
    background: var(--bg-4);
    transition: all .2s;
    z-index: 10000000000000;

    &::after {
        content: " ";
        width: 8px;
        height: 8px;
        position: absolute;
        border-radius: 3px;
        background: var(--bg-4);
        z-index: -1;
    }

    &.top {
        &::after {
            bottom: -7px;
        }
    }
    &.bottom {
        &::after {
            top: -2px;
        }
    }
    &.top, &.bottom {
        &::after {
            left: 50%;
            transform: rotate(45deg) translateX(-50%);
        }
    }

    &.left {
        &::after {
            right: -3px;
        }
    }
    &.right {
        &::after {
            left: -7px;
        }
    }
    &.left, &.right {
        &::after {
            top: 50%;
            transform: rotate(45deg) translateY(-50%);
        }
    }

    &-show, &-hide {
        transition: all .2s;
        opacity: 0;
    }

    &-show {
        &.top {
            transform: translateY(4px);
        }
        &.left {
            transform: translateX(4px);
        }
        &.right {
            transform: translateX(-4px);
        }
        &.bottom {
            transform: translateY(-4px);
        }
    }
}

</style>